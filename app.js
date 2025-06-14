const url = "https://openlibrary.org/search.json?title=";

document.querySelector("#search").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission
    console.log("clicked");

    const thead = document.querySelector("thead");
    const tbody = document.querySelector("tbody");
    const name = document.querySelector("#name").value;
    
    thead.innerHTML = ""; // Clear table headers
    tbody.innerHTML = ""; // Clear previous results

    createHeader(thead);
    
    const data = await getData(url, name);
    console.log(data);

    if (data?.docs?.length) {
        data.docs.forEach((ele, index) => {
            createRow(tbody, index + 1, ele.title, ele.author_name?.join(", "), ele.first_publish_year, ele.ebook_access);
        });
    }
});

async function getData(url, name) {
    try {
        const res = await axios.get(url + name);
        return res.data;
    } catch (err) {
        console.error("Error fetching data:", err);
        return null;
    }
}

function createHeader(thead) {
    const headers = ["#", "Title", "Author", "Publish Year", "Ebook Access"];
    const tr = document.createElement("tr");

    headers.forEach((text,idx) => {
        const th = document.createElement("th");
        th.innerText = text;
        if(idx===3){th.classList.add("text-nowrap")};
        tr.appendChild(th);
    });

    thead.appendChild(tr);
}

function createRow(tbody, sNo, title, author, publishYear,Availability) {
    const tr = document.createElement("tr");

    const tdData = [sNo, title, author || "Unknown", publishYear || "N/A" ,Availability];
    tdData.forEach((text,idx) => {
        if(idx===4){
            const availabilityBtn = document.createElement("button");
            availabilityBtn.classList.add("btn");
            availabilityBtn.classList.add("w-100");
            availabilityBtn.innerText = text;
            changeColor(availabilityBtn,text);
            
            const tdAvailability = document.createElement("td");
            tdAvailability.appendChild(availabilityBtn);
            tr.appendChild(tdAvailability);
        }else{
            const td = document.createElement("td");
            td.innerText = text;
            tr.appendChild(td);
        }
    });



    tbody.appendChild(tr);
}

function changeColor(obj, Availability) {
    switch (Availability) {
        case "borrowable":
            obj.classList.add("btn-success")
            break;
            
        case "public":
            obj.classList.add("btn-warning")
            break;
        case "no_ebook":
            obj.classList.add("btn-secondary")
            break;
        
        case "printdisabled":
            obj.classList.add("btn-danger")
            break;

        default:
            break;
    }
}