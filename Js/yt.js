// Appending buttons from API
const buttonAction = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/categories`)
    const buttonAllInfo = await res.json();
    const buttonData = buttonAllInfo.data;

    const categoryBtn = document.getElementById('category-btn'); // calling the Categories Button dic

    buttonData.forEach(i => {
        categoryBtn.innerHTML += `
        <button class="btn btn-primary font-semibold text-gray-600 text-lg bg-gray-300 hover:bg-red-600 hover:text-white border-none rounded-lg px-5 py-2" onclick= "loadVideo('${i.category_id}')">${i.category}</button>
        `
    }); // sending (i.category_id) as parameter to the loadVideo function.
}

buttonAction();

// loading Videos from API
const loadVideo = async (categoryId) => {
    //initiating loader
    toggleLoader(true);

    await new Promise(resolve => setTimeout(resolve, 200)); // Add a delay to ensure loader visibility

    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
    const dataWhole = await res.json();
    const data = dataWhole.data;
    displayVideos(data);
};

const displayVideos = (data) => {

    const cardSection = document.getElementById('card-section');
    cardSection.textContent = ''; // Clear existing content before adding new ones

    if (data.length > 0){
        cardSection.classList.add('grid');
        data.forEach(data => {
            const card = document.createElement('div');
            card.classList = `rounded-lg overflow-hidden shadow-lg mb-14`;
    
            // Convert the posted time using the timeConvert function
            const postedTime = timeConvert(data.others.posted_date);
    
            // Determine if the author is verified
            let verifiedIcon = ''; // Initialize the variable
    
            if (data.authors[0].verified === true) {
                verifiedIcon = '<img src="icons/social-media.png" alt="" class="">';
            }
    
            card.innerHTML = `
            <div class="relative">
                <img class="w-full h-[16rem] object-cover" src="${data.thumbnail}" alt="Thumbnail">
                <!-- Time badge -->
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded" hidden>
                    ${postedTime}
                </div>
            </div>
                <!-- Content Section -->
            <div class="p-4">
            <div class="flex items-center mt-3 gap-3">
                <img class="w-10 h-10 rounded-full" src="${data.authors[0].profile_picture}" alt="User">
                <h2 class="text-lg font-bold text-gray-900">${data.title}</h2>
            </div>
                <div class="mt-1">
                    <div class="ml-[3.22rem]">
                        <div class="flex items-center mb-1">
                            <p class="text-sm font-medium text-gray-700">${data.authors[0].profile_name}</p>
                            <span class="ml-1.5">${verifiedIcon}</span>
                        </div>
                        <p class="text-sm text-gray-600"><span id="viewNumber">${data.others.views}</span></p>
                    </div>
                </div>
            </div>
            `
            cardSection.appendChild(card);
        });
    }else{
        emptyAlert();
    }
    toggleLoader(false); // hide spinning loader after successful data load
};

// empty alert function:
const emptyAlert = () => {
    const cardSection = document.getElementById('card-section');
    cardSection.classList.remove('grid');
    cardSection.innerHTML = `
    <div class="flex flex-col items-center justify-center my-40">
        <img class="w-1/6 mb-10" src="icons/noResFound.png" alt=":(">
        <h1 class="text-5xl font-bold leading-tight">Oops!!Sorry, There is no Content Here</h1>
    </div>
    `
}

// time conversion
const timeConvert = (seconds) => {
    if (!seconds) return ""; // return an empty string if there's no input

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    const timeParts = [];

    if (hrs) 
        timeParts.push(`${hrs}hrs`);
    if (mins) 
        timeParts.push(`${mins}min`);

    return `${timeParts.join(' ')} ago`; // joining array items by whitespace
}


// loader function
const toggleLoader = (isLoading) => {
    const spinLoader = document.getElementById('spinner-load')
    if (isLoading){
        spinLoader.classList.remove('hidden');
    }else{
        spinLoader.classList.add('hidden');
    }
}

// Sort By View buttons onclick:
const sortVideos = () => {
    const cardSection = document.getElementById('card-section');

    if(cardSection.children.length === 0) {
        emptyAlert(); // Display empty alert
    }

    const videoCards = Array.from(cardSection.children); // converts the collection of child elements inside the cardSection container into an array

    const videosData = videoCards.map(card => { // card iterates on every array element
        // This selects the element that contains the view count text
        const viewCountElement = card.querySelector('#viewNumber'); //selects the id of where views reside.
        
        // The view count text (e.g., "1.1K") is passed to parseViewCount
        const viewCount = viewCountElement.innerText;
        
        return {
            card, // the original card element
            views: parseViewCount(viewCount) // Here, viewCount is passed to parseViewCount
        };
    });

    // Sort the videosData by views in descending order
    videosData.sort((a, b) => b.views - a.views); // If b.views is greater than a.views, the result will be positive, meaning b should come before a in the sorted order (descending order).

    // Re-render sorted videos
    cardSection.innerHTML = '';
    videosData.forEach(video => {
        cardSection.appendChild(video.card); // this is why returning the 'card' from sortVideos was important 
    });
}

// Function to convert view count string to number (only 'k' format)
const parseViewCount = (viewCount) => {
    if (!viewCount) return 0;

    const numberPart = parseFloat(viewCount.replace(/[^0-9.]/g, '')); // The expression viewCount.replace(/[^0-9.]/g, '') is a JavaScript string method used to remove all characters from the viewCount string except for digits (0-9) and decimal points (.)
    return numberPart * 1000; // Convert 'k' to thousands
};

/* #Note-1: after "const videoCards = Array.from(cardSection.children);", videoCards will look like:

    [
        {
            // First video card element
            tagName: "DIV", // tagName and className are default properties provided by the DOM (Document Object Model) API in JavaScript
            className: "video-card",
            innerHTML: `
                <p id="viewNumber">1.2K</p>
                <h2>Video Title 1</h2>
            `
        },
        {
            // Second video card element
            tagName: "DIV".....
        }
    ] 
        
#Note-2: the returned obj from sortVideo will look like this:

    [
        {
            card: <div class="video-card">...</div>, // The entire HTML element for the video card
            views: 1200 // The parsed view count
        },
        {
            card: <div class="video-card">...</div>,
            views: 900000
        }
    ]
    
    */