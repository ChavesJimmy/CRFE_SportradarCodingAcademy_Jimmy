document.addEventListener("DOMContentLoaded", function () {
  const eventDetailContainer = document.getElementById('event-detail');

  // Parse query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);

  const homeTeam = urlParams.get('homeTeam');
  const awayTeam = urlParams.get('awayTeam');
  const dateVenue = urlParams.get('dateVenue');
  const timeVenueUTC = urlParams.get('timeVenueUTC');
  const stadium = urlParams.get('stadium');
  const result = urlParams.get('result');
  const stage = urlParams.get('stage');
  const competition = urlParams.get('competition');

  // Display event details
  if (homeTeam !== 'N/A') {
    eventDetailContainer.innerHTML = `
      <h2>${homeTeam} vs ${awayTeam}</h2>
      <div class="detailBox">
      <p>Date: ${dateVenue}</p>
      <p>Time: ${timeVenueUTC}</p>
      <p>Stadium: ${stadium || 'Not specified'}</p>
      <p>Result: ${result}</p>
      <p>Stage: ${stage}</p>
      <p>Competition: ${competition}</p>
      </div>
    `;
  } else {
    eventDetailContainer.innerHTML = `
      <h2>N/A vs ${awayTeam}</h2>
      <div class="detailBox">
      <p>Date: ${dateVenue}</p>
      <p>Time: ${timeVenueUTC}</p>
      <p>Stadium: ${stadium || 'Not specified'}</p>
      <p>Result: ${result}</p>
      <p>Stage: ${stage}</p>
      <p>Competition: ${competition}</p>
      </div>
    `;
  }
});
