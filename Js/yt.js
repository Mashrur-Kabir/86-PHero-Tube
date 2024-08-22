const buttonAction = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/categories`)
    const buttonAllInfo = await res.json();
    const buttonData = buttonAllInfo.data;

    const categoryBtn = document.getElementById('category-btn'); // calling the Categories Button dic

    buttonData.forEach(i => {
        categoryBtn.innerHTML += `
        <button class="btn btn-primary font-semibold text-gray-600 text-lg bg-gray-300 hover:bg-red-600 hover:text-white border-none rounded-lg px-5 py-2" onclick="loadVideo('${i.category_id}'); toggleLoader(true)">${i.category}</button>
        `
    });
}

buttonAction();

const loadVideo = async (categoryId) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
    const dataWhole = await res.json();
    const data = dataWhole.data;
    displayVideos(data);
}

const displayVideos = (data) => {

    const cardSection = document.getElementById('card-section');
    cardSection.innerHTML = ''; // Clear existing content before adding new ones

    data.forEach(data => {
        const card = document.createElement('div');
        card.classList = `rounded-lg overflow-hidden shadow-lg`;

        // Convert the posted time using the timeConvert function
        const postedTime = timeConvert(data.others.posted_date);

        // Determine if the author is verified
        const isVerified = data.authors[0].verified;
        const verifiedIcon = isVerified ? '<img src="icons/social-media" alt="">' : '';

        card.innerHTML = `
        <div class="relative">
            <img class="w-full h-[16rem] object-cover" src="${data.thumbnail}" alt="Thumbnail">
            <!-- Time badge -->
            <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                ${postedTime}
            </div>
        </div>
            <!-- Content Section -->
        <div class="p-4">
            <h2 class="text-lg font-semibold text-gray-900">${data.title}</h2>
            <div class="flex items-center mt-3">
                <img class="w-8 h-8 rounded-full" src="${data.authors[0].profile_picture}" alt="User">
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">${data.authors[0].profile_name}<span class="ml-4">${verifiedIcon}</span></p>
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
    if (!seconds) return ""; // return an empty string if there's no date

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = "";

    if (hrs > 0) 
        result += `${hrs}hrs `;
    if (mins > 0 || hrs > 0) 
        result += `${mins}min `;
    result += `${secs}sec ago`;

    return result.trim(); // trim means the result will be sent without extra whitespace
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