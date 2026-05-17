const GlitchText = ({ text, className = "", tag: Tag = "span" }) => {
    return (
        <Tag
            className={`glitch-text inline-block ${className}`}
            data-text={text}
            aria-label={text}
        >
            {text}
        </Tag>
    );
};

export default GlitchText;
