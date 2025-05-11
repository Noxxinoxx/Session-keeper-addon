
const addButton = document.getElementById('addCurrentList');

addButton.addEventListener('click', async () => {
  // Get all tabs
  let tabs = await browser.tabs.query({});

  // Get current storage
  const result = await browser.storage.local.get("UrlStorage");
  let currentStorage = result.UrlStorage || [];

  // Determine new index
  let newIndex = currentStorage.length > 0
    ? currentStorage[currentStorage.length - 1].index + 1
    : 0;

  let input = document.getElementById("sessionName").value;

  if(input.trim() === "") {
    alert("Session needs to have a name.")
    return;
  }


  // Create storage object
  let storageObject = {
    index: newIndex,
    name: input.trim(), 
    tabs: tabs.map(tab => ({ url: tab.url, title: tab.title })) // keep only relevant fields
  };

  // Add and save
  currentStorage.push(storageObject);
  await browser.storage.local.set({ UrlStorage: currentStorage });

  // Log the new storage
  console.log("Updated Storage:", currentStorage);
});



// Fetch and populate the dropdown with saved sessions
async function loadSavedSessions() {
  const result = await browser.storage.local.get("UrlStorage");
  const savedSessions = result.UrlStorage || [];

  // Get the dropdown element
  const dropdown = document.getElementById('sessionDropdown');

  // Clear any existing options
  dropdown.innerHTML = '<option value="">Select a session</option>';

  // Populate dropdown with saved sessions
  savedSessions.forEach((session, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `Session ${session.name}`;
    dropdown.appendChild(option);
  });
}

// Display the URLs of the selected session in the list
async function displayUrlsForSession(sessionIndex) {
  const result = await browser.storage.local.get("UrlStorage");
  const savedSessions = result.UrlStorage || [];

  // Get the selected session by index
  const selectedSession = savedSessions[sessionIndex];

  // Get the <ul> element where the URLs will be listed
  const urlList = document.getElementById('urlList');
  urlList.innerHTML = ''; // Clear the list before adding new items

  // Add each URL in the selected session to the list
  selectedSession.tabs.forEach(tab => {
    const listItem = document.createElement('li');
    const urlLink = document.createElement('a');
    urlLink.href = tab.url;
    urlLink.textContent = tab.title || tab.url;  // Display the title or URL if no title exists
    urlLink.target = '_blank'; // Open the link in a new tab
    listItem.appendChild(urlLink);
    urlList.appendChild(listItem);
  });
}

// Handle session selection and display URLs
document.getElementById('sessionDropdown').addEventListener('change', (e) => {
  const selectedIndex = e.target.value;

  if (selectedIndex === "") {
    return; // If no session is selected, do nothing
  }

  // Display the URLs of the selected session
  displayUrlsForSession(selectedIndex);
});

// Load saved sessions when the options page is opened
loadSavedSessions();

// Load the URLs of the selected session when the "Load URLs" button is clicked
document.getElementById('loadUrls').addEventListener('click', async () => {
  const dropdown = document.getElementById('sessionDropdown');
  const selectedIndex = dropdown.value;

  if (!selectedIndex) {
    alert('Please select a session!');
    return;
  }

  const result = await browser.storage.local.get("UrlStorage");
  const savedSessions = result.UrlStorage || [];

  // Get the selected session
  const selectedSession = savedSessions[selectedIndex];

  // Open each URL in the session
  selectedSession.tabs.forEach(tab => {
    browser.tabs.create({ url: tab.url });
  });
});
document.getElementById('removeSession').addEventListener('click', async () => {
  const dropdown = document.getElementById('sessionDropdown');
  const selectedIndex = dropdown.value;

  if (!selectedIndex) {
    alert('Please select a session to remove.');
    return;
  }

  const result = await browser.storage.local.get("UrlStorage");
  let savedSessions = result.UrlStorage || [];

  // Remove the selected session
  savedSessions.splice(selectedIndex, 1);

  // Save the updated list back to storage
  await browser.storage.local.set({ UrlStorage: savedSessions });

  // Refresh the UI
  await loadSavedSessions();
  document.getElementById('urlList').innerHTML = '';
});
