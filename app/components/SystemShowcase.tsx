import React from "react";

const styles = `
  * {
    box-sizing: border-box;
  }

  .systems-page {
    min-height: 100vh;
    width: 100%;
    background: #000;
    color: #fff;
    padding: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family:
      Inter,
      ui-sans-serif,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .systems-grid {
    width: 100%;
    max-width: 1400px;
    height: 580px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .card {
    position: relative;
    overflow: hidden;
    border: 1px solid #242424;
    border-radius: 6px;
    background: #000;
  }

  /* LEFT FEATURE */

  .feature-card {
    grid-row: span 2;
    min-height: 0;
  }

  .feature-graphic {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .graphic-line {
    position: absolute;
    border: 1px solid #111;
  }

  .graphic-line.line-1 {
    width: 58%;
    height: 59px;
    top: 45px;
    left: 0;
  }

  .graphic-line.line-2 {
    width: 151px;
    height: 59px;
    top: 197px;
    left: 0;
  }

  .graphic-line.line-3 {
    width: 202px;
    height: 59px;
    top: 352px;
    left: 0;
  }

  .graphic-slash {
    position: absolute;
    width: 1px;
    height: 465px;
    background: #151515;
    transform: rotate(39deg);
    transform-origin: center;
    top: -105px;
    left: 68%;
  }

  .graphic-slash.second {
    left: 71%;
    opacity: 0.8;
  }

  .feature-content {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }

  .mark {
    width: 78px;
    height: 27px;
    display: flex;
    align-items: center;
    margin-bottom: 11px;
  }

  .mark span {
    display: block;
    height: 3px;
    background: #fff;
  }

  .mark .m1 {
    width: 23px;
    margin-right: 7px;
    box-shadow:
      0 8px 0 #fff,
      0 16px 0 #fff;
  }

  .mark .m2 {
    width: 15px;
    transform: skew(-30deg);
    margin-right: 4px;
  }

  .mark .m3 {
    width: 23px;
    transform: skew(30deg);
  }

  .feature-description {
    margin: 0;
    color: #999;
    font-size: 13px;
    line-height: 1.5;
    letter-spacing: -0.01em;
  }

  /* RIGHT TOP */

  .passport-card {
    min-height: 0;
  }

  .passport-content {
    position: absolute;
    left: 20px;
    bottom: 20px;
    max-width: 280px;
    z-index: 2;
  }

  .card-title {
    margin: 0 0 5px;
    font-size: 23px;
    line-height: 1;
    font-weight: 400;
    letter-spacing: -0.055em;
  }

  .card-description {
    margin: 0;
    color: #969696;
    font-size: 13px;
    line-height: 1.45;
    max-width: 285px;
  }

  .passport {
    position: absolute;
    right: 39px;
    top: 40px;
    width: 280px;
    height: 240px;
    border-radius: 9px 9px 0 0;
    background: #171717;
    overflow: hidden;
  }

  .passport::before {
    content: "";
    position: absolute;
    width: 130px;
    height: 200px;
    left: -30px;
    bottom: -80px;
    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.025),
      transparent 65%
    );
  }

  .passport-word {
    position: absolute;
    top: 31px;
    left: 90px;
    color: #b9b9b9;
    font-size: 12px;
    line-height: 1.95;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .passport-triangle {
    position: absolute;
    bottom: 23px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 18px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 31px solid #fff;
  }

  /* RIGHT BOTTOM */

  .containers-card {
    min-height: 0;
  }

  .containers-content {
    position: absolute;
    left: 20px;
    bottom: 20px;
    z-index: 2;
  }

  .terminal {
    position: absolute;
    right: 0;
    top: 39px;
    width: 53%;
    height: calc(100% - 39px);
    border-left: 1px solid #242424;
    background: #090909;
    padding: 17px 16px;
    font-family:
      "SFMono-Regular",
      "Cascadia Code",
      "Roboto Mono",
      Consolas,
      monospace;
    font-size: 12px;
    line-height: 1.65;
    color: #a4a4a4;
  }

  .terminal-header {
    color: #d5d5d5;
    margin-bottom: 5px;
  }

  .terminal-line {
    white-space: nowrap;
  }

  .terminal-line.success {
    color: #b9b9b9;
  }

  .terminal-line.success::first-letter {
    color: #fff;
  }

  .terminal-production {
    margin-top: 5px;
    color: #929292;
  }

  @media (max-width: 1000px) {
    .systems-page {
      padding: 24px;
    }

    .systems-grid {
      height: auto;
      min-height: 650px;
      grid-template-columns: 1fr;
    }

    .feature-card {
      height: 430px;
      grid-row: auto;
    }

    .passport-card,
    .containers-card {
      height: 300px;
    }

    .passport {
      right: 30px;
      top: 30px;
    }
  }

  @media (max-width: 600px) {
    .systems-page {
      padding: 14px;
    }

    .systems-grid {
      gap: 12px;
    }

    .feature-card {
      height: 390px;
    }

    .passport-card,
    .containers-card {
      height: 270px;
    }

    .passport {
      width: 190px;
      height: 205px;
      right: 18px;
      top: 25px;
    }

    .passport-word {
      left: 65px;
      top: 24px;
      font-size: 9px;
    }

    .passport-triangle {
      bottom: 18px;
      border-left-width: 13px;
      border-right-width: 13px;
      border-bottom-width: 23px;
    }

    .passport-content,
    .containers-content {
      left: 16px;
      bottom: 16px;
    }

    .card-title {
      font-size: 20px;
    }

    .card-description,
    .feature-description {
      font-size: 12px;
    }

    .terminal {
      width: 58%;
      padding: 13px 11px;
      font-size: 9px;
    }
  }
`;

export default function SystemsShowcase() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <main className="systems-page">
        <section className="systems-grid">
          {/* Large left card */}
          <article className="card feature-card">
            <div className="feature-graphic">
              <div className="graphic-line line-1" />
              <div className="graphic-line line-2" />
              <div className="graphic-line line-3" />

              <div className="graphic-slash" />
              <div className="graphic-slash second" />
            </div>

            <div className="feature-content">
              <div className="mark" aria-hidden="true">
                <span className="m1" />
                <span className="m2" />
                <span className="m3" />
              </div>

              <p className="feature-description">
                A framework for building durable agents.
              </p>
            </div>
          </article>

          {/* Passport */}
          <article className="card passport-card">
            <div className="passport-content">
              <h2 className="card-title">Passport</h2>

              <p className="card-description">
                Secure every internal agent, app, and deployment with your
                identity provider.
              </p>
            </div>

            <div className="passport">
              <div className="passport-word">
                VERCEL&nbsp;&nbsp;&nbsp;&nbsp; PASSPORT
                <br />
                PASAPORTE
                <br />
                PASSAPORTO
                <br />
                パスポート
              </div>

              <div className="passport-triangle" />
            </div>
          </article>

          {/* Containers */}
          <article className="card containers-card">
            <div className="containers-content">
              <h2 className="card-title">Containers</h2>

              <p className="card-description">
                Run production workloads in isolated containers on Vercel.
              </p>
            </div>

            <div className="terminal">
              <div className="terminal-header">▲ vercel deploy</div>

              <div className="terminal-line">Vercel CLI</div>

              <div className="terminal-line success">
                ✓ Building image from Dockerfile.vercel
              </div>

              <div className="terminal-line success">
                ✓ Stored image in your project's registry
              </div>

              <div className="terminal-line success">
                ✓ Deployed to Fluid compute
              </div>

              <div className="terminal-production">
                Production: https://my-server.vercel.app
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
