// Kiểm tra nếu đang ở trang information.html thì mới chạy TimelineJS
if (window.location.pathname.includes("information.html")||window.location.pathname.includes("information")) {
    var timeline_json = {
        "title": {
            "text": {
                "headline": "My Chinese Town - Lịch sử Quận 5",
                "text": "Khám phá những cột mốc quan trọng của Quận 5."
            }
        },
        "events": [
            {
                "start_date": { "year": "1800" },
                "text": { "headline": "Thế kỷ 19 - Quận 5 hình thành", "text": "Những năm đầu tiên của Quận 5 với ảnh hưởng Trung Hoa." },
                "media": { "url": "images/1.jpg", "caption": "Hình ảnh đầu tiên của Quận 5" }
            },
            {
                "start_date": { "year": "1900" },
                "text": { "headline": "Năm 1900 - Chợ Lớn phát triển", "text": "Quận 5 trở thành trung tâm thương mại sầm uất." },
                "media": { "url": "images/2.jpg", "caption": "Chợ Lớn thời kỳ phát triển" }
            },
            {
                "start_date": { "year": "1950" },
                "text": { "headline": "Năm 1950 - Kiến trúc độc đáo", "text": "Sự hòa trộn giữa kiến trúc Hoa và Pháp tại Quận 5." },
                "media": { "url": "images/3.jpg", "caption": "Kiến trúc tiêu biểu" }
            },
            {
                "start_date": { "year": "2000" },
                "text": { "headline": "Năm 2000 - Hiện đại hóa", "text": "Quận 5 phát triển mạnh mẽ với những tòa nhà mới." },
                "media": { "url": "images/4.jpg", "caption": "Sự phát triển hiện đại" }
            },
            {
                "start_date": { "year": "2024" },
                "text": { "headline": "Năm 2024 - Văn hóa & Du lịch", "text": "Quận 5 ngày nay là điểm đến du lịch văn hóa sôi động." },
                "media": { "url": "images/5.jpeg", "caption": "Hình ảnh Quận 5 ngày nay" }
            }
        ]
    };

    // Khởi tạo TimelineJS
    window.onload = function () {
        timeline = new TL.Timeline('timeline-embed', timeline_json);
    };
}

async function searchGoogleImages() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert("Vui lòng nhập từ khóa tìm kiếm!");
        return;
    }

    const imageResults = document.getElementById('image-results');
    imageResults.innerHTML = '<p>Đang tìm kiếm trên Google...</p>';

    const apiKey = "AIzaSyDxxHbS8pbCgFani7_W3NBFRawD4n9EsW0";
    const cx = "61a1ab3eb8b4941c2";  
    const searchTerm = `${query}`;

    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchTerm)}&cx=${cx}&searchType=image&cr=countryVN&key=${apiKey}&num=5`;
    

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            imageResults.innerHTML = '<p>Không tìm thấy hình ảnh nào trên Google.</p>';
            return;
        }

        imageResults.innerHTML = ''; // Xóa nội dung cũ

        data.items.forEach(item => {
            const imgElement = document.createElement("img");
            imgElement.src = item.link;
            imgElement.alt = query;
            imgElement.style.width = "300px";
            imgElement.style.margin = "10px";
            imageResults.appendChild(imgElement);
        });

    } catch (error) {
        console.error("Lỗi khi tìm kiếm ảnh Google:", error);
        imageResults.innerHTML = '<p>Đã xảy ra lỗi khi tải ảnh từ Google.</p>';
    }
}

// Hàm tìm kiếm hình ảnh
async function searchImages() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert("Vui lòng nhập từ khóa tìm kiếm!");
        return;
    }

    const searchTerm = `Quận 5 ${query}`; // Kết hợp tìm kiếm với "Quận 5"
    const imageResults = document.getElementById('image-results');
    if (!imageResults) {
        console.error("Không tìm thấy phần tử #image-results. Kiểm tra lại HTML.");
        return;
    }
    imageResults.innerHTML = '<p>Đang tìm kiếm...</p>';

    try {
        // 🔍 Bước 1: Lấy page ID từ Wikipedia
        // const pageApi = `https://vi.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(searchTerm)}`;
        const searchApi = `https://vi.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(searchTerm)}`;
        const searchResponse = await fetch(searchApi);
        const searchData = await searchResponse.json();
        const searchResults = searchData.query.search;

        if (searchResults.length === 0) {
            imageResults.innerHTML = '<p>Không tìm thấy bài viết phù hợp.</p>';
            return;
        }

        // Lấy bài viết đầu tiên có kết quả
        const pageTitle = searchResults[0].title;

        // Gọi API lần nữa để lấy pageId từ tiêu đề tìm được
        const pageApi = `https://vi.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(pageTitle)}`;

        console.log("Fetching page API:", pageApi);
        
        const pageResponse = await fetch(pageApi);
        const pageData = await pageResponse.json();
        console.log("Page Data:", pageData);

        const pages = pageData.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === "-1") {
            imageResults.innerHTML = '<p>Không tìm thấy bài viết phù hợp.</p>';
            return;
        }

        // 📸 Bước 2: Lấy danh sách hình ảnh từ bài viết
        const imageApi = `https://vi.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=images&pageids=${pageId}`;
        console.log("Fetching image API:", imageApi);

        const imageResponse = await fetch(imageApi);
        const imageData = await imageResponse.json();
        console.log("Image Data:", imageData);

        const images = imageData.query.pages[pageId]?.images || [];

        if (!images || images.length === 0) {
            imageResults.innerHTML = '<p>Không tìm thấy hình ảnh nào.</p>';
            return;
        }

        if (images.length === 0) {
            imageResults.innerHTML = '<p>Không tìm thấy hình ảnh trong bài viết này. Đang tìm kiếm hình ảnh liên quan...</p>';
            
            // Tìm hình ảnh khác từ Wikimedia Commons
            const commonsApi = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=5&prop=imageinfo&iiprop=url`;
            const commonsResponse = await fetch(commonsApi);
            const commonsData = await commonsResponse.json();
            
            const commonsPages = commonsData.query?.pages || {};
            let count = 0;

            for (let key in commonsPages) {
                if (count >= 3) break;
                const imageUrl = commonsPages[key].imageinfo?.[0]?.url;
                if (imageUrl) {
                    const imgElement = document.createElement("img");
                    imgElement.src = imageUrl;
                    imgElement.alt = query;
                    imgElement.style.width = "300px";
                    imgElement.style.margin = "10px";
                    imageResults.appendChild(imgElement);
                    count++;
                }
            }

            if (count === 0) {
                imageResults.innerHTML = '<p>Không tìm thấy hình ảnh nào.</p>';
            }

            return;
        }

        
        


        // 🖼️ Bước 3: Lấy link ảnh từ Wikimedia Commons
        imageResults.innerHTML = ''; // Xóa nội dung cũ
        let count = 0;

        for (let img of images) {
            if (count >= 3) break; // Chỉ lấy 3 ảnh
            await new Promise(resolve => setTimeout(resolve, 500)); // Tránh spam request

            const fileName = img.title.replace("File:", "");
            const fileApi = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url`;
            console.log("Fetching file API:", fileApi);

            const fileResponse = await fetch(fileApi);
            const fileData = await fileResponse.json();
            console.log("File Data:", fileData);

            const filePage = Object.values(fileData.query.pages)[0];

            if (filePage.imageinfo) {
                const imageUrl = filePage.imageinfo[0].url;
                const imgElement = document.createElement("img");
                imgElement.src = imageUrl;
                imgElement.alt = query;
                imgElement.style.width = "300px";
                imgElement.style.margin = "10px";
                imageResults.appendChild(imgElement);
                count++;
            }
        }

        if (count === 0) {
            imageResults.innerHTML = '<p>Không tìm thấy hình ảnh nào.</p>';
        }

    } catch (error) {
        console.error('Lỗi khi tìm kiếm ảnh:', error);
        imageResults.innerHTML = '<p>Đã xảy ra lỗi khi tải ảnh.</p>';
    }
}



// Script Game ghép hình
const sourceContainer = document.getElementById("sources");
const puzzleContainer = document.getElementById("puzzle");

// Danh sách hình
const images = Array.from({ length: 16 }, (_, i) => `game/${i + 1}.png`);

// Tạo hình trong khung Sources
images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.draggable = true;
    img.id = `piece-${index + 1}`;
    img.dataset.index = index + 1;
    img.addEventListener("dragstart", dragStart);
    sourceContainer.appendChild(img);
});

// Thêm event cho ô trống
document.querySelectorAll(".dropzone").forEach((zone) => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("drop", drop);
});

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const imgId = event.dataTransfer.getData("text");
    const draggedImg = document.getElementById(imgId);
    const dropzone = event.target.closest(".dropzone");
    
    if (!dropzone) return; // Đảm bảo chỉ drop vào đúng ô

    // Nếu ô đã có ảnh, xóa ảnh cũ trước khi thêm mới
    const existingImg = dropzone.querySelector("img");
    if (existingImg) {
        dropzone.removeChild(existingImg);
    }

    // Tạo clone của ảnh để fit vào block
    const newImg = document.createElement("img");
    newImg.src = draggedImg.src;
    newImg.dataset.index = draggedImg.dataset.index;
    newImg.draggable = false;

    dropzone.appendChild(newImg);

    // Kiểm tra đúng vị trí hay không
    if (newImg.dataset.index === dropzone.dataset.index) {
        dropzone.classList.add("correct");
    } else {
        dropzone.classList.remove("correct");
    }
}
