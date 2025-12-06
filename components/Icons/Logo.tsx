export default function Logo() {
  return (
    <svg
      aria-labelledby="eric-logo-title-header"
      fill="none"
      role="img"
      viewBox="0 0 172 26"
      width="172"
      height="26"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 
      This logo used to be a Next.JS Conf logo that looked pretty sleek. Perhaps I should have skipped 
      having a logo for the initial release of henziger.se, but instead I thought to ask ChatGPT for a 
      SVG logo saying Eric Henziger. It had a lot of trouble getting the G correctly, and it took some
      creative liberties flipping some letters horizontally. Still better than nothing perhaps, I'll keep
      it for now. Fair to say, ChatGPT is neither the best nor the worst tool for generating SVG graphics.
      */}
      <title id="eric-logo-title-header">ERIC HENZIGER</title>
      <g fill="currentColor" transform="scale(0.6)">
        {/* E */}
        <path d="M0 0V4.12H17.88V10.75H3.5V14.87H17.88V21.67H0V25.79H22.3V4.12H22.3V0H0Z" />
        {/* R */}
        <path d="M27 0V25.79H31.5V17H39L44 25.79H49L42 14.5C45.5 13 48 10 48 6.5C48 2.5 44.5 0 40 0H27ZM31.5 4H39C40.5 4 42 5 42 6.5C42 8 40.5 9 39 9H31.5V4Z" />
        {/* I */}
        <path d="M54 0V25.79H59V0H54Z" />
        {/* C */}
        <path d="M64 6C64 2 67.5 0 71 0H82V4H71C70 4 68 5 68 6.5V19.3C68 20.5 70 21.7 71 21.7H82V25.79H71C67.5 25.79 64 23.2 64 19.3V6Z" />
        {/* H */}
        <path d="M88 0V25.79H93V15H105V25.79H110V0H105V11H93V0H88Z" />
        {/* E */}
        <path d="M115 0V4.12H132.88V10.75H118.5V14.87H132.88V21.67H115V25.79H137.3V4.12H137.3V0H115Z" />
        {/* N */}
        <path d="M142 0V25.79H147L161 7V25.79H166V0H161L147 18.5V0H142Z" />
        {/* Z */}
        <path d="M171 0V4H186L171 21.7V25.79H191V21.7H176L191 4V0H171Z" />
        {/* I */}
        <path d="M196 0V25.79H201V0H196Z" />
        {/* G (C with added notch) */}
        <path d="M206 6C206 2 209 0 213 0H224V4H213C212 4 210 5 210 6.5V19.3C210 20.5 212 21.7 213 21.7H224V17H218V13H228V25.79H213C209 25.79 206 23.2 206 19.3V6Z" />
        {/* E */}
        <path d="M233 0V4.12H250.88V10.75H236.5V14.87H250.88V21.67H233V25.79H255.3V4.12H255.3V0H233Z" />
        {/* R */}
        <path d="M260 0V25.79H264.5V17H272L277 25.79H282L275 14.5C278.5 13 281 10 281 6.5C281 2.5 277.5 0 273 0H260ZM264.5 4H272C273.5 4 275 5 275 6.5C275 8 273.5 9 272 9H264.5V4Z" />
      </g>
    </svg>
  );
}
