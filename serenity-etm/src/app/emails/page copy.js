export default function EmailsPage () {
    return (
        <div className="relative h-screen">
            {readEmailCount >= 5 && emotionValue >= 70 && (
                <BreakPopup
                    scenario= 'emails'
                    onAcknowledge={() => setReadEmailCount(0)}
                />
            )}
        </div>
    );
}