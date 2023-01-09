(function(){
    const root = document.getElementById("root");
    function refresh(district_id = 457) {
        removeAllItem();
        root.innerHTML = "";
        const date = new Date();
        const today = `${date.getDate()}-${
            date.getMonth() + 1
        }-${date.getFullYear()}`;
        let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${today}`;
        const xml = new XMLHttpRequest();
        xml.open("GET", url, true);

        xml.onload = function () {
            document.querySelector("img").setAttribute("style", "display: none;");
            document
            .querySelector("body")
            .setAttribute("style", "display: block;");
            if (this.status === 200) {
                const res = JSON.parse(this.responseText);
                res.centers.forEach((item, index) => {
                    const {center_id, name, address, state_name, district_name, pincode, fee_type, sessions} = item;
                    const cardCol6 = document.createElement("div");
                    cardCol6.className = "col-sm-6 data-fetch";
                    const card = document.createElement("div");
                    card.className = "card mt-2";
                    const cardBody = document.createElement("div");
                    cardBody.className = "card-body";
                    cardBody.innerHTML = `
                    <a class="btn" href="#item${index}" data-toggle="collapse">
                        <h5 className="card-title">${name}<i><sup>Center Id: ${center_id}</sup></i></h5>
                        <p class="card-text p-0 mb-0">Address: ${address}, ${state_name}, ${district_name}</p>
                        <p class="card-text p-0 mb-0">Pin: ${pincode}</p>
                        <p class="card-text p-0 mb-0">Fee: ${iteratePrice(item?.vaccine_fees)}</p></a>
                        <div id="item${index}" class="collapse">${iterateSession(sessions, index)}</div>
                    `;
                    card.appendChild(cardBody);
                    cardCol6.appendChild(card);
                    document.querySelector("#push-item").appendChild(cardCol6);
                    document.querySelectorAll(".btn-danger").forEach(elem => {
                        elem.parentElement.parentElement.classList.add('bg-secondary');
                    })
                });
            }
        };
        xml.send();
    }
    const listStateAPI = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
    fetch(listStateAPI)
        .then(result => result.json())
        .then(res => res.states.forEach(item => {
        let option = document.createElement('option');
        option.setAttribute("value", item.state_id);
        option.innerText = item.state_name;
        document.querySelector("#state_item").appendChild(option);
        }));
    document.querySelector("#state_item").addEventListener("change", (e)=> {
    document.querySelectorAll(".districtListItem").forEach(item => item.remove());
    removeAllItem();
    const cityValue = e.target.value;
    const districtElem = document.querySelector("#district_item");
    const listDistrictAPI = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+cityValue;
    fetch(listDistrictAPI)
        .then(result => result.json())
        .then(response => response.districts.forEach(item => {
        let option = document.createElement("option");
        option.setAttribute("value", item.district_id);
        option.className = "districtListItem";
        option.innerText = item.district_name;
        districtElem.appendChild(option);
        }));
    });
    document.querySelector("#district_item").addEventListener("change", (e) =>{
        removeAllItem();
        refresh(e.target.value);
    })
})();
document.querySelectorAll(".data-fetch").forEach(item => {
    document.querySelectorAll(".btn-danger").forEach(item => item.parentElement.parentElement.style.backgroundColor="red");
})
const iterateSession = (sessions, ind) => {
    let output = "";
    sessions.forEach((session, index) => {
        const {available_capacity, available_capacity_dose1, available_capacity_dose2, date, vaccine, slots} = session;
        output += `
            <hr class="m-2">
            <a href="#target${ind}${index}" class="btn ${available_capacity === 0 ? "btn-danger" : "btn-primary"}" data-toggle="collapse">Date: ${date}</a>
            <p class="card-text p-0 mb-0">Vaccine Type: ${vaccine}</p>
            <b><p class="card-text p-0 mb-0">Capacity: ${available_capacity}</p></b>
            <p class="card-text p-0 mb-0">Available Dose 1: ${available_capacity_dose1}</p>
            <p class="card-text p-0 mb-0">Available Dose 2: ${available_capacity_dose2}</p>
            <div id="target${ind}${index}" class="collapse">${iterateSlots(slots)}</div>
        `;
    });
    return output;
};
const iterateSlots = (slots) => {
    let output = "";
    slots.forEach(slot => {
        const {time, seats} = slot;
        output += `
            <b><p class="card-text p-0 mb-0">Time: ${time}, Seats: ${seats}</p></b>
        `;
    })
    return output;
}
const iteratePrice = (prices) => {
    let output = "";
    if(prices !== undefined){
        prices.forEach(price => {
            output = `<span>${price.fee}</span>`;
        })
    }else {
        output = "Free";
    }
    return output;
}
const removeAllItem = () => document.querySelectorAll(".data-fetch").forEach(item => item.remove());;