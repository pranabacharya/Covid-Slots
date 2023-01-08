const root = document.getElementById("root");
      function refresh(district_id = 457) {
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
            let output = "";
            res.centers.forEach((item) => {
              if (
                item.sessions[0].available_capacity_dose1 != 0 ||
                item.sessions[0].available_capacity_dose2 != 0
              ) {
                output = `
                      <div class="card bg-white mt-3 rounded px-2 p-3">
                          Address : ${item.name}, ${item.address}<b>PIN: ${item.pincode}</b>
                          Date : ${item.sessions[0].date}<br>
                          Min Age : ${item.sessions[0].min_age_limit}<br>
                          Vaccine Type : ${item.sessions[0].vaccine}<br>
                          Available Dose 1 : ${item.sessions[0].available_capacity_dose1}<br>
                          Available Dose 2 : ${item.sessions[0].available_capacity_dose2}<br>
                          <a href = "https://selfregistration.cowin.gov.in/" target="_blank">Book Slot</a>
                      </div>
                   `;
                root.innerHTML += output;
              }
            });
            res.centers.forEach((item) => {
              if (
                item.sessions[0].available_capacity_dose1 === 0 ||
                item.sessions[0].available_capacity_dose2 === 0
              ) {
                root.innerHTML += `<p class="text-secondary">No Vaccination Center Available in ${item.pincode}</p>`;
              }
            });
          }
        };
        xml.send();
      }
      setInterval(refresh, 100*1000);
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
        refresh(e.target.value);
      })