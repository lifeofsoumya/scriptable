const websites = [
  { name: "Ocode", url: "https://www.google.com", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/ocode_mini.png" },
  { name: "Nated", url: "https://www.github.com", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/pepeso.png" },
  { name: "Pepeso", url: "https://stackover.com", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/sm.png" }
];

// Load previous uptime data from Keychain
function loadUptimeData() {
  const key = "uptimeData";
  if (Keychain.contains(key)) {
      const data = Keychain.get(key);
      return JSON.parse(data);
  } else {
      // If no data exists, initialize it
      return Array(websites.length).fill([]).map(() => []);
  }
}

// Save uptime data to Keychain
function saveUptimeData(data) {
  const key = "uptimeData";
  Keychain.set(key, JSON.stringify(data));
}

let uptimeData = loadUptimeData(); // Load existing uptime data

let widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}

Script.complete();

async function createWidget() {
  let w = new ListWidget();
  w.setPadding(15, 15, 15, 15);

  // Set a gradient background
  let gradient = new LinearGradient();
  gradient.locations = [0, 1];
  gradient.colors = [
      new Color("#000000"),
      new Color("#202432")
  ];
  
  w.backgroundGradient = gradient;

  // Check website statuses and update uptime data
  let statuses = await checkWebsites(websites);
  
  // Create a horizontal stack for the status and refresh button
  let mainStack = w.addStack();
  mainStack.layoutHorizontally();
  
  // Left stack for website statuses
  let statusStack = mainStack.addStack();
  statusStack.layoutVertically();
  statusStack.size = new Size(200, 0); // Set width to take more than half of the total width

  for (let i = 0; i < websites.length; i++) {
      // Update uptime data
      uptimeData[i].push(statuses[i]);
      if (uptimeData[i].length > 12) {
          uptimeData[i].shift(); // Remove the oldest status if more than 12
      }

      // Create a horizontal stack for each website's logo and status boxes
      let box = statusStack.addStack();
      box.layoutHorizontally(); // Change to horizontal layout

      // Add website logo on the left
      let logo = await loadImage(websites[i].logo);
      let logoImage = box.addImage(logo);
      logoImage.imageSize = new Size(30, 30); // Set smaller size for the logo
      logoImage.centerAlignImage(); // Center the image

      // Create uptime status boxes to the right of the logo
      let uptimeStack = box.addStack();
      uptimeStack.layoutHorizontally();
      
      for (let j = 0; j < uptimeData[i].length; j++) {
          let statusBox = uptimeStack.addStack();
          statusBox.size = new Size(10, 10); // Box size
          statusBox.backgroundColor = uptimeData[i][j] ? new Color("#00FF00") : new Color("#FF0000"); // Green or red
          uptimeStack.addSpacer(2); // Space between boxes
      }

      w.addSpacer(8); // Space between website boxes
  }

  saveUptimeData(uptimeData); // Save updated uptime data

  // Right stack for refresh button with SF Symbol
  let refreshStack = mainStack.addStack(); 
  refreshStack.layoutVertically(); 
  refreshStack.size = new Size(100, 0); // Set width for refresh button area

  let refreshSymbol = refreshStack.addImage(SFSymbol.named("arrow.clockwise").image);
  refreshSymbol.imageSize = new Size(30, 30); // Set size for the symbol
  refreshSymbol.tintColor = Color.white();
refreshSymbol.centerAlignImage(); // Center the symbol
  
  refreshSymbol.url = "scriptable:///run/uptimev2"; // Replace with your script name

  return w;
}

async function loadImage(url) {
  let req = new Request(url);
  return await req.loadImage(); // Load the image from URL
}

async function checkWebsites(websites) {
  let statuses = [];

  for (let website of websites) {
      try {
          let req = new Request(website.url);
          await req.load(); // Load the request to check the status
          statuses.push(true); // Status is OK (200)
      } catch (error) {
          statuses.push(false); // Status is not OK
      }
  }

  return statuses;
}