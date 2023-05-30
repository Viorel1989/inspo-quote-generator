const sharp = require("sharp");
const apiURL = "https://zenquotes.io/api/random";
const fetch = require("node-fetch");

// 1.fetch a random qoute
// 2.turn tect of qoute into lines(quote received)
// 3. turn text of author into a lines
// 4. add a qoute image
// 5. turn elements --> SVG
// 6.SVG --> image as png (/base 64 in lambda)

async function getRandomQuote(apiURLInput) {
  //My quote is..
  let quoteText;

  // Author Name
  let quoteAuthor;

  // Validate API response
  const response = await fetch(apiURLInput);
  var qouteData = await response.json();
  console.log(qouteData);

  //   qoute elements

  quoteText = qouteData[0].q;
  quoteAuthor = qouteData[0].a;

  //   Image construction
  const width = 750;
  const height = 483;
  const text = quoteText;
  const words = text.split(" ");
  const lineBreak = 4;
  let newText = "";

  //   Define some tspanElements with 4 words each
  let tspanElements = "";
  for (let i = 0; i < words.length; i++) {
    newText += words[i] + " ";
    if ((i + 1) % lineBreak === 0) {
      tspanElements += `<tspan x="${width / 2}" dy="1.2em">${newText}</tspan>`;
      newText = "";
    }
  }
  if (newText !== "") {
    tspanElements += `<tspan x="${width / 2}" dy="1.2em">${newText}</tspan>`;
  }
  console.log(tspanElements);

  //  Construct  the SVG
  const svgImage = `
    <svg width="${width}" height="${height}">
    <style>
    .title {
        fill: #ffffff;
        font-size: 20px;
        font-weight: bold;
    }
    .quoteAuthorStyles {
        font-size: 35px;
        font-weight: bold;
        padding: 50px;
    }
    .footerStyles {
        font-size: 20px;
        font-weight: bold;
        fill: lightgrey;
        text-anchor: middle;
        font-family: Verdana;
    }
    </style>
    <circle cx="382" cy="76" r="44" fill="rgba(255, 255, 255, 0.155)"/>
    <text x="382" y="76" dy="50" text-anchor="middle" font-size="90" font-family="Verdana" fill="white"></text>
    <g>
        <rect x="0" y="0" width="${width}" height="auto"></rect>
        <text id="lastLineOfQuote" x="375" y="120" font-family="Verdana" font-size="35" fill="white" text-anchor="middle>
            ${tspanElements}
            <tspan class="quoteAuthorStyles" x="375" dy="1.8em>- ${quoteAuthor}</tspan>
        </text>
    </g>
    <text x="${width / 2}" y="${height - 10}" class="footerStyles">
    Developed by Viorel | Quotes from ZenQuotes.io</text>
    </svg>
`;

  // Add backgrounds for svg creation
  const backgroundImages = [
    "backgrounds/Aubergine.svg",
    "backgrounds/Mantle.svg",
    "backgrounds/Midnight-City.svg",
    "backgrounds/Orange-Fun.svg",
  ];

  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  const selectedBackgroundImage = backgroundImages[randomIndex];

  //   Composite image togheter
  const timestamp = new Date().toLocaleString().replace(/[^\d]/g, "");
  const svgBuffer = Buffer.from(svgImage);

  const image = await sharp(selectedBackgroundImage)
    .composite([
      {
        input: svgBuffer,
        top: 0,
        left: 0,
      },
    ])
    .toFile(`finals/qoute-card_${timestamp}.svg`);
}

getRandomQuote(apiURL);
