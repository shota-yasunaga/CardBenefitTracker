// Reusable UI Components

// Don't Care Button Component
function DontCareButton({ label, onClick, className = "" }) {
    return (
        <button
            onClick={onClick}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors bg-gray-200 text-gray-600 hover:bg-gray-300 ${className}`}
            title={label === "Don't Care" ? "Mark as don't care" : ""}
        >
            {label}
        </button>
    );
}

// Don't Care Status Display Component
function DontCareStatus({ onUndo }) {
    return (
        <div className="flex gap-2">
            <span className="text-sm text-gray-400 font-medium">
                Don't Care
            </span>
            <DontCareButton
                label="Undo"
                onClick={onUndo}
            />
        </div>
    );
}

// Action Button Group Component
function ActionButtonGroup({ children }) {
    return (
        <div className="flex gap-2">
            {children}
        </div>
    );
}