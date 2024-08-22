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

/* const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // delaying the fetching of data to show the loader a bit more */

// loading Videos from API
const loadVideo = async (categoryId) => {
    // initiating loader
    toggleLoader(true);

    /* // Delay before starting the fetch operation
    await delay(900); // Adjust the delay time as needed (e.g., 300ms) */

    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
    const dataWhole = await res.json();
    const data = dataWhole.data;
    displayVideos(data);
}

const displayVideos = (data) => {

    const cardSection = document.getElementById('card-section');
    cardSection.textContent = ''; // Clear existing content before adding new ones

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
                    <p class="text-sm text-gray-600">${data.others.views}</p>
                </div>
            </div>
        </div>
        `
        cardSection.appendChild(card);
    });
    toggleLoader(false); // hide spinning loader after successful data load
};

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