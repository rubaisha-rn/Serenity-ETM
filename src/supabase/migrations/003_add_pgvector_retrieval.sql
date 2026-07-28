-- Enable pgvector (Supabase ships this extension — just needs turning on)
create extension if not exists vector;

-- nomic-embed-text (the Ollama embedding model) outputs 768-dimension
-- vectors, so the column has to match that exactly.
alter table emails add column embedding vector(768);

-- Index for fast approximate nearest-neighbour search. Without this,
-- similarity search does a full table scan — fine at your current email
-- volume, but add it now so it's not a surprise later.
create index emails_embedding_idx on emails
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Retrieval function: given an email's embedding, find the most similar
-- OTHER emails the current user can actually see.
--
-- `security invoker` means this function runs with the CALLING user's
-- permissions, not the function owner's — so your existing RLS policy on
-- `emails` ("auth.uid() = receiver_id OR auth.uid() = sender_id") is
-- enforced automatically. The explicit auth.uid() check in the WHERE
-- clause below is redundant with that RLS policy, but kept for clarity
-- and as a second line of defence.
create or replace function match_emails(
  query_embedding vector(768),
  match_count int default 3,
  exclude_id uuid default null
)
returns table (
  id uuid,
  subject text,
  body text,
  similarity float
)
language sql
stable
security invoker
as $$
  select
    emails.id,
    emails.subject,
    emails.body,
    1 - (emails.embedding <=> query_embedding) as similarity
  from emails
  where emails.embedding is not null
    and (exclude_id is null or emails.id <> exclude_id)
    and (auth.uid() = emails.receiver_id or auth.uid() = emails.sender_id)
  order by emails.embedding <=> query_embedding
  limit match_count;
$$;
