const websites = [
    { name: "Ocode", url: "https://ocode.dev", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/ocode_mini.png" },
    { name: "Nated", url: "https://pepeso.com", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/pepeso.png" },
    { name: "Pepeso", url: "https://soumyamondal.com", logo: "https://static-logosm.s3.ap-south-1.amazonaws.com/sm.png" }
];

let api = await todoApi()
let widget = await createWidget(api)

if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    await widget.presentMedium();
}

Script.complete();

async function createWidget(api) {
    let w = new ListWidget();
    w.setPadding(15, 15, 15, 15);

    // Set a gradient background
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [
        new Color("141414"),
        new Color("13233F")
    ];
    w.backgroundGradient = gradient;

    // Add logo image
    const logoImage = await loadImage("https://d1quwwdmdfumn6.cloudfront.net/t3n/2018/images/logos/t3n_logo_420x420.png");
    const logo = w.addImage(logoImage);
    logo.imageSize = new Size(20, 20);
    // logo.centerAlignImage();
    
    // Add heading
    const heading = w.addText(api.name);
    heading.font = Font.boldSystemFont(18);
    heading.textColor = Color.white();
    w.addSpacer(5);

    // Fetch paragraph data from an API or RSS feed
    const paragraph = w.addText(api.description);
    paragraph.font = Font.systemFont(14);
    paragraph.textColor = Color.white();
    paragraph.lineLimit = 3; // Limit to 3 lines
    w.addSpacer(5);

    // Add button with arrow icon
    const buttonStack = w.addStack();
    buttonStack.layoutHorizontally();
    
    const buttonText = buttonStack.addText("Read More");
    buttonText.font = Font.boldSystemFont(14);
    buttonText.textColor = Color.blue();


    let docsSymbol = SFSymbol.named("arrow.up.forward")
    let docsElement = buttonStack.addImage(docsSymbol.image)
    docsElement.imageSize = new Size(20, 20)
    docsElement.tintColor = Color.blue()
    docsElement.imageOpacity = 0.5
    docsElement.url = api.url

    // const arrowImage = await loadImage("https://static-logosm.s3.ap-south-1.amazonaws.com/pepeso.png"); // Replace with actual arrow icon URL
    // const arrowIcon = buttonStack.addImage(arrowImage);
    // arrowIcon.imageSize = new Size(20, 20);
    
    w.addSpacer(10);
    

    // Create a horizontal stack for website status boxes
    const statusStack = w.addStack();
    statusStack.layoutHorizontally();
    
    let statuses = await checkWebsites(websites);

    for (let i = 0; i < websites.length; i++) {
        let box = statusStack.addStack();
        box.layoutVertically();
        box.cornerRadius = 7;
        box.setPadding(2, 2, 2, 2);
        box.backgroundColor = statuses[i] ? new Color("#00FF00", 0.3) : new Color("#FF0000", 0.3); // Green or red

        const logoStatusImage = await loadImage(websites[i].logo);
        let logoStatus = box.addImage(logoStatusImage);
        logoStatus.imageSize = new Size(20, 20);
        logoStatus.centerAlignImage();

        box.addSpacer(5);
        
        statusStack.addSpacer(8); // Space between boxes
    }

    // const rocketIconUrl = "https://static-logosm.s3.ap-south-1.amazonaws.com/pepeso.png"; // Replace with actual rocket icon URL
    // const rocketIconImage = await loadImage(rocketIconUrl);
    
    // const rocketIconStack = w.addStack();
    // rocketIconStack.layoutHorizontally();
    
    // const rocketIcon = rocketIconStack.addImage(rocketIconImage);
    // rocketIcon.imageSize = new Size(40, 40);
    
    return w;
}

async function loadImage(url) {
    let req = new Request(url);
    return await req.loadImage(); 
}

async function todoApi() {
    let docs = await loadDocs()
    return {
        name: docs["todo"],
        description: docs["context"],
        url: docs["url"]
    }
}

async function loadDocs() {
    let url = "https://static-logosm.s3.ap-south-1.amazonaws.com/cal.json" // change this to your calender endpoint which fetches latest activity to do
    let req = new Request(url)
    return await req.loadJSON()
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