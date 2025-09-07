// app/games/page.tsx
const GamesPage = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <section
        aria-labelledby="games-heading"
        style={{
          textAlign: "center",
          maxWidth: 720,
          width: "100%",
          padding: "2rem",
          borderRadius: 12,
        }}
      >
        <svg
          height="64"
          style={{
            marginBottom: 16,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          viewBox="0 0 24 24"
          width="64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Coming soon icon</title>
          <path
            d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 11.414V7h-2v6.414L8.293 14.12 7.88 15.53 12 17l4.12-1.47-.414-1.414L13 13.414z"
            fill="currentColor"
          />
        </svg>

        <h1 id="games-heading" style={{ margin: 0, fontSize: "1.75rem" }}>
          Games — Coming soon
        </h1>

        <p style={{ color: "#555", marginTop: 8 }}>
          We're building an exciting catalog of games. Check back soon for
          updates and announcements.
        </p>

        <p style={{ marginTop: 16 }}>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Return home
          </a>
        </p>
      </section>
    </main>
  );
};

export default GamesPage;
