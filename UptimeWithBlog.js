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
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [
        new Color("#b00a0fe6"),
        new Color("#b00a0fb3")
    ];
    w.backgroundGradient = gradient;

    // Add logo image
    const logoImage = await loadImage("https://d1quwwdmdfumn6.cloudfront.net/t3n/2018/images/logos/t3n_logo_420x420.png");
    const logo = w.addImage(logoImage);
    logo.imageSize = new Size(60, 60);
    logo.centerAlignImage();
    
    // Add heading
    const heading = w.addText("Your Heading");
    heading.font = Font.boldSystemFont(18);
    heading.textColor = Color.white();
    w.addSpacer(5);

    // Fetch paragraph data from an API or RSS feed
    const paragraphText = await fetchParagraphData(); // Assume this function fetches a paragraph
    const paragraph = w.addText(paragraphText);
    paragraph.font = Font.systemFont(14);
    paragraph.textColor = Color.white();
    paragraph.lineLimit = 3; // Limit to 3 lines
    w.addSpacer(5);

    // Add button with arrow icon
    const buttonStack = w.addStack();
    buttonStack.layoutHorizontally();
    
    const buttonText = buttonStack.addText("Read More");
    buttonText.font = Font.boldSystemFont(14);
    buttonText.textColor = Color.white();

    const arrowImage = await loadImage("https://static-logosm.s3.ap-south-1.amazonaws.com/pepeso.png"); // Replace with actual arrow icon URL
    const arrowIcon = buttonStack.addImage(arrowImage);
    arrowIcon.imageSize = new Size(20, 20);
    
    w.addSpacer(10);

    // Create a horizontal stack for website status boxes
    const statusStack = w.addStack();
    statusStack.layoutHorizontally();
    
    let statuses = await checkWebsites(websites); // Check website statuses

    for (let i = 0; i < websites.length; i++) {
        let box = statusStack.addStack();
        box.layoutVertically();
        box.cornerRadius = 10;
        box.setPadding(10, 10, 10, 10);
        box.backgroundColor = statuses[i] ? new Color("#00FF00", 0.3) : new Color("#FF0000", 0.3); // Green or red

        const logoStatusImage = await loadImage(websites[i].logo);
        let logoStatus = box.addImage(logoStatusImage);
        logoStatus.imageSize = new Size(30, 30);
        logoStatus.centerAlignImage();

        box.addSpacer(5);
        let statusText = box.addText(websites[i].name);
        statusText.font = Font.systemFont(12);
        statusText.textColor = Color.white();
        
        statusStack.addSpacer(8); // Space between boxes
    }

    // Add rocket icon at the right bottom
    const rocketIconUrl = "https://static-logosm.s3.ap-south-1.amazonaws.com/pepeso.png"; // Replace with actual rocket icon URL
    const rocketIconImage = await loadImage(rocketIconUrl);
    
    const rocketIconStack = w.addStack();
    rocketIconStack.layoutHorizontally();
    
    const rocketIcon = rocketIconStack.addImage(rocketIconImage);
    rocketIcon.imageSize = new Size(40, 40);
    
    return w;
}

async function loadImage(url) {
    let req = new Request(url);
    return await req.loadImage(); 
}

async function fetchParagraphData() {
   // Mock API call to get a paragraph (replace with actual API call)
   return "This is a sample paragraph fetched from an API or RSS feed.";
}

async function checkWebsites(websites) {
   let statuses = [];
   
   for (let website of websites) {
       try {
           let req = new Request(website.url);
           await req.load(); 
           statuses.push(true); 
       } catch (error) {
           statuses.push(false); 
       }
   }
   
   return statuses;
}