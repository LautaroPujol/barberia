export function StepIndicator({ currentStep, totalSteps = 4 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "52px" }}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div
            className="step-indicator"
            style={{
              background: currentStep >= s
                ? "linear-gradient(135deg, #c9a84c, #f0d080)"
                : "#141414",
              border: currentStep >= s ? "none" : "1px solid #2a2520",
              color: currentStep >= s ? "#1a1208" : "#e8dcc833",
            }}
          >
            {s}
          </div>
          {i < totalSteps - 1 && (
            <div style={{ width: "60px", height: "1px", background: currentStep > s ? "#c9a84c55" : "#1e1a14" }} />
          )}
        </div>
      ))}
    </div>
  );
}