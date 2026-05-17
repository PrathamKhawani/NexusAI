const NeonInput = ({
    id, label, type = "text", value, onChange, onKeyDown,
    placeholder = "", required = false, autoComplete = "off", icon: Icon,
}) => {
    return (
        <div className="neon-input-wrap">
            {label && (
                <label htmlFor={id} className="neon-label">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neon-cyan)] opacity-60 pointer-events-none">
                        <Icon size={16} />
                    </span>
                )}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    required={required}
                    autoComplete={autoComplete}
                    className={`neon-input ${Icon ? '!pl-10' : ''}`}
                />
            </div>
        </div>
    );
};

export default NeonInput;
