export default function QuickPromptButtons({ prompts, onPromptClick }) {
  return (
    <section className="quick-prompts" aria-label="התחלה מהירה">
      {prompts.map((prompt) => (
        <button key={prompt.label} type="button" onClick={() => onPromptClick(prompt)}>
          {prompt.label}
        </button>
      ))}
    </section>
  );
}
