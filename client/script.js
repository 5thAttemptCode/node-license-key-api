// Ask for license key
const licenseKey = prompt("Enter your license key")
const statusEl = document.getElementById("status")
// Send that key to backend server
fetch("http://localhost:3000/validate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  // Sending the key as JSON
  body: JSON.stringify({ key: licenseKey })
})
.then(async (res) => {
  const data = await res.json()

  // res.ok instead "res.status === 200", its abuilt-in boolean shortcut for any 2xx status codes
  // checks if the res is ok AND if data is valid, instead of assuming all 2xx status are valid
  if(res.ok && data.valid){
    // data.message is coming from the backend
    statusEl.textContent = `✅ ${data.message}`
  } else{
    statusEl.textContent = `❌ ${data.message || "Invalid license key"}`
  }
})
.catch(error => {
  console.error("Error: ", error)
  statusEl.textContent = "❌ Couldn't connect to server"
})