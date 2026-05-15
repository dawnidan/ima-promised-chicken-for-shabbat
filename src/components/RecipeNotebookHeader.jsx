export default function RecipeNotebookHeader() {
  return (
    <section className="hero">
      <div className="hero-badges" aria-hidden="true">
        <span>♡</span>
        <span>🌿</span>
        <span>🥄</span>
      </div>

      <img
        className="hero-illustration"
        src="/recipe-notebook-illustration.png"
        alt=""
        aria-hidden="true"
      />

      <h1>אמא, הבטחת לנו עוף לשבת 🍗</h1>
      <p className="description">
        מחברת מתכונים חכמה שמונעת משברי רעב, שאלות מיותרות, וקריאות מצוקה לחסדי נעמי.
      </p>
    </section>
  );
}
