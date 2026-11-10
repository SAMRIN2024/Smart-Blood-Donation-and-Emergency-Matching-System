const API = "http://localhost:5000/api";

// Donor Registration
const donorForm = document.getElementById("donorForm");

if (donorForm) {
    donorForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const donor = {
            name: document.getElementById("donorName").value,
            age: Number(document.getElementById("donorAge").value),
            gender: document.getElementById("donorGender").value,
            blood_group: document.getElementById("donorBlood").value,
            phone: document.getElementById("donorPhone").value,
            city: document.getElementById("donorCity").value
        };

        try {
            const response = await fetch(`${API}/donors`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(donor)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            document.getElementById("donorMessage").innerText =
                "Donor registered successfully!";

            this.reset();

        } catch(error) {
            document.getElementById("donorMessage").innerText =
                error.message || "Registration failed!";
        }
    });
}


// Blood Request
const requestForm = document.getElementById("requestForm");

if (requestForm) {
    requestForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const request = {
            patient_name: document.getElementById("patientName").value,
            blood_group: document.getElementById("requestBlood").value,
            units: Number(document.getElementById("units").value),
            hospital: document.getElementById("hospital").value,
            city: document.getElementById("requestCity").value,
            phone: document.getElementById("requestPhone").value,
            emergency: document.getElementById("emergency").checked
        };

        try {
            const response = await fetch(`${API}/requests`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(request)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            document.getElementById("requestMessage").innerText =
                "Blood request submitted successfully!";

            this.reset();

        } catch(error) {
            document.getElementById("requestMessage").innerText =
                error.message || "Request failed!";
        }
    });
}


// Find Donors
const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const blood = document.getElementById("searchBlood").value;
        const city = document.getElementById("searchCity").value.trim();

        const results = document.getElementById("donorResults");

        results.innerHTML = "Searching donors...";

        try {
            const response = await fetch(`${API}/donors`);

            if (!response.ok) {
                throw new Error("Unable to load donors");
            }

            const donors = await response.json();

            const matches = donors.filter(donor =>
                donor.blood_group === blood &&
                donor.city.toLowerCase() === city.toLowerCase() &&
                Number(donor.available ?? 1) === 1
            );

            results.innerHTML = "";

            if (matches.length === 0) {
                results.innerHTML = "<p>No matching donors found.</p>";
                return;
            }

            results.innerHTML = "<h3>Potential Matching Donors</h3>";

            matches.forEach(donor => {
                const card = document.createElement("div");
                card.className = "donor-card";

                const name = document.createElement("strong");
                name.textContent = donor.name;

                const details = document.createElement("p");
                details.textContent =
                    `Blood Group: ${donor.blood_group} | City: ${donor.city}`;

                card.append(name, details);
                results.appendChild(card);
            });

        } catch(error) {
            results.innerHTML =
                "<p>Unable to search donors. Check the server.</p>";
        }
    });
}