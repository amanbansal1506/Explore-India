const map = L.map('map').setView([22.59, 78.96], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom icons for each category
const icons = {
  monument: L.icon({ iconUrl: 'icons/monument.png', iconSize: [30, 30] }),
  nature: L.icon({ iconUrl: 'icons/nature.png', iconSize: [30, 30] }),
  religious: L.icon({ iconUrl: 'icons/religious.png', iconSize: [30, 30] }),
  corporate: L.icon({ iconUrl: 'icons/corporate.png', iconSize: [30, 30] }),
  restaurant: L.icon({ iconUrl: 'icons/restaurant.png', iconSize: [30, 30] })
};

// Place data
const places = [
  // Monuments
  { name: "India Gate", coords: [28.6129, 77.2295], category: "monument", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/India_Gate_on_the_evening_of_77th_Independence_day.jpg/960px-India_Gate_on_the_evening_of_77th_Independence_day.jpg", desc: "War memorial in Delhi." },
  { name: "Taj Mahal", coords: [27.1751, 78.0421], category: "monument", img: "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg", desc: "Marble mausoleum in Agra." },
  { name: "Red Fort", coords: [28.6562, 77.2410], category: "monument", img: "https://cdn.britannica.com/20/189820-050-D650A54D/Red-Fort-Old-Delhi-India.jpg", desc: "Historic Mughal fort." },
  { name: "Amber Fort", coords: [26.9855, 75.8507], category: "monument", img: "https://media1.thrillophilia.com/filestore/h9oc8fq0cfh9lhja3oomu3kjwphj_1574335340_shutterstock_741766687.jpg", desc: "Hilltop fort in Jaipur." },
  { name: "Gateway of India", coords: [18.9218, 72.8347], category: "monument", img: "https://lp-cms-production.imgix.net/2019-06/bbc886323ff07d295157ea35f423e121-gateway-of-india.jpg", desc: "Seaside monument in Mumbai." },

  // Nature
  { name: "Kerala Backwaters", coords: [9.5011, 76.3474], category: "nature", img: "https://lp-cms-production.imgix.net/2025-04/shutterstock2454866115.jpg?auto=format,compress&q=72&w=1440&h=810&fit=crop", desc: "Peaceful water canals." },
  { name: "Pangong Lake", coords: [33.7246, 78.9533], category: "nature", img: "https://acmekashmirtravels.com/images/pongong.jpg", desc: "Beautiful lake in Ladakh." },
  { name: "Naini Lake", coords: [29.3926, 79.4544], category: "nature", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnXjZuZJf13afUpsqBCwtSQVw-fB_aQ1VdlQ&s", desc: "Lake in Nainital." },

  // Religious
  { name: "Golden Temple", coords: [31.6200, 74.8765], category: "religious", img: "", desc: "Holy Sikh shrine." },
  { name: "Meenakshi Temple", coords: [9.9195, 78.1190], category: "religious", img: "", desc: "Dravidian-style temple." },
  { name: "Somnath Temple", coords: [20.8880, 70.4012], category: "religious", img: "", desc: "Historic temple in Gujarat." },
  { name: "Jagannath Temple", coords: [19.8060, 85.8181], category: "religious", img: "", desc: "Sacred Hindu site in Puri." },

  // Corporate
  { name: "Cyber City", coords: [28.4946, 77.0894], category: "corporate", img: "", desc: "Corporate hub, Gurugram." },
  { name: "Cyber Park", coords: [28.4595, 77.0732], category: "corporate", img: "", desc: "Tech park by DLF." },
  { name: "Sector 44", coords: [28.4696, 77.0652], category: "corporate", img: "", desc: "Startups and IT offices." },
  { name: "HITEC City", coords: [17.4504, 78.3826], category: "corporate", img: "", desc: "Major tech zone in Hyderabad." },
  { name: "Electronic City", coords: [12.8452, 77.6602], category: "corporate", img: "", desc: "Bangalore’s IT hub." },

 // Restaurant Chains
{ name: "Burger King - Connaught Place", coords: [28.6328, 77.2197], category: "restaurant", img: "", desc: "Popular Burger King outlet in CP, Delhi." },
{ name: "Burger King - Bandra", coords: [19.0550, 72.8290], category: "restaurant", img: "", desc: "Busy BK location in Bandra, Mumbai." },

{ name: "McDonald's - Saket", coords: [28.5244, 77.2080], category: "restaurant", img: "", desc: "McD outlet in DLF Place Mall, Saket." },
{ name: "McDonald's - MG Road", coords: [12.9756, 77.6050], category: "restaurant", img: "", desc: "Iconic McDonald's on MG Road, Bangalore." },

{ name: "Domino's - South Ex", coords: [28.5666, 77.2234], category: "restaurant", img: "", desc: "Domino's Pizza in South Extension, Delhi." },
{ name: "Domino's - Park Street", coords: [22.5531, 88.3518], category: "restaurant", img: "", desc: "Domino’s outlet on Park Street, Kolkata." },

];

let currentMarker = null;

// Function to add marker
function showMarker(place) {
  if (currentMarker) map.removeLayer(currentMarker);
  currentMarker = L.marker(place.coords, { icon: icons[place.category] }).addTo(map);

  let popupHTML = `<b>${place.name}</b><br>${place.desc}`;
  if (place.img) {
    popupHTML += `<br><img src="${place.img}" alt="${place.name}" style="width:100px; margin-top:5px;" />`;
  }

  currentMarker.bindPopup(popupHTML).openPopup();
}

// Search functionality
document.getElementById('search-input').addEventListener('input', e => {
  const val = e.target.value.toLowerCase().trim();
  if (!val) return;

  const matched = places.find(p => p.name.toLowerCase().includes(val));
  if (matched) {
    map.setView(matched.coords, 14);
    showMarker(matched);
  }
});

// Category filter
const filters = document.querySelectorAll('.filter');
filters.forEach(f => {
  f.addEventListener('change', () => {
    const selected = Array.from(filters).filter(f => f.checked).map(f => f.value);

    // Hide current marker if it's outside of filtered view
    if (currentMarker) {
      const markerCat = places.find(p => p.coords[0] === currentMarker.getLatLng().lat)?.category;
      if (!selected.includes(markerCat)) {
        map.removeLayer(currentMarker);
        currentMarker = null;
      }
    }
  });
});
