### **Serenity ETM – Emotion-Aware Email \& Task Manager**

Serenity ETM is a **prototype productivity tool** designed to reduce cognitive overload and workplace stress by adapting its interface based on the user’s inferred emotional state.

The system combines **email and task management** with **emotion-aware interaction design**, dynamically adjusting the interface to support focus and reduce information overload.

This project was developed as part of a **final-year computer science project exploring adaptive user interfaces and calm technology principles**.



#### **Running the Project Locally**

1. **Clone the Repository**
   git clone <repository-url>
   cd serenity-etm
2. **Install Dependencies**
   npm install
   or
   yarn install
3. **Configure Environment Variables**
   This project requires an .env file containing environment variables.

   Create a file named:
   **.env.local**
   inside the serenity-etm directory.

   Add the following variables:
   NEXT\_PUBLIC\_SUPABASE\_URL=supabase\_project\_url\_from\_the\_report
   NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=supabase\_anon\_key\_from\_the\_report
   NEXT\_PUBLIC\_MORPHCAST\_API\_KEY=morphcast\_api\_key\_from\_the\_report

   The .env file is not included in this repository because it contains sensitive credentials. You must create your own .env.local file using the variables above, with the credentials provided in the report.

4. **Run the Development Server**
   npm run dev
   or
   yarn dev

   The application will be available at:
   http://localhost:3000

5. **Authentication Setup**
   The system uses Supabase authentication.

   To use the system locally:
   Create an account
   Verify the email address
   Sign in to access the workspace

   **or**

   Use the test user credentials provided in the report.

   

   User-specific data such as emails and tasks are stored securely using Row Level Security (RLS) policies.

   

#### **Prototype Notice**

This system is a research prototype developed for academic purposes.
Certain features may be simplified and the system is not intended for production use.

   

#### **License**

This project is intended for academic research and demonstration purposes.

