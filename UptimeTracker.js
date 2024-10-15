const websites = [
    { name: "Ocode", url: "https://www.google.com", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/ocode_mini.png" },
    { name: "Nated", url: "https://www.github.com", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/pepeso.png" },
    { name: "Pepeso", url: "https://stackoverfl.com", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/sm.png" }
];
  
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
    let gradient = new LinearGradient()
    gradient.locations = [0, 1]
    gradient.colors = [
        new Color("#b00a0fe6"),
        new Color("#b00a0fb3")
    ]
    let widget = new ListWidget()
    widget.backgroundColor = new Color("#b00a0f")
    widget.backgroundGradient = gradient;
  
    // Check website statuses
    let statuses = await checkWebsites(websites);
  
    // Create a horizontal stack for websites
    let websiteStack = w.addStack();
    websiteStack.layoutHorizontally();
    
    for (let i = 0; i < websites.length; i++) {
      let website = websites[i];
      let status = statuses[i];
  
      // Create a box for each website
      let box = websiteStack.addStack();
      box.layoutVertically();
      box.cornerRadius = 10; // Rounded corners
      box.setPadding(10, 10, 10, 10);
      
      // Set background color with transparency
      box.backgroundColor = status ? new Color("#00FF00", 0.3) : new Color("#FF0000", 0.3); // Green or red with transparency
  
      // Add website logo
      let logo = await loadImage(website.logo);
      let logoImage = box.addImage(logo);
      logoImage.imageSize = new Size(50, 50); // Set size for the logo
      logoImage.centerAlignImage(); // Center the image
  
      websiteStack.addSpacer(8); // Space between boxes
    }
  
    // Set refresh interval to save battery (e.g., refresh every hour)
    w.refreshAfterDate = new Date(Date.now() + (3600 * 1000)); // Refresh after one hour
    
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