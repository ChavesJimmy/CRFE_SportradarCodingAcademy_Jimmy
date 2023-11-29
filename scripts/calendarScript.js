document.addEventListener("DOMContentLoaded", function () {
    const addEventForm = document.getElementById('addEventForm');
    const calendarContainer = document.getElementById('calendar');
    const currentMonthElement = document.getElementById('currentMonth');
    const events = [];
  
    // Load events from JSON file
    fetch('./scripts/sportData.json')
      .then(response => response.json())
      .then(data => {
        events.push(...data.data);
        generateCalendar(new Date());
      })
      .catch(error => console.error('Error loading events:', error));
  
    addEventForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      // Get form values
      const homeTeam = document.getElementById('homeTeam').value;
      const abbreviationHomeTeam = document.getElementById('abbreviationHomeTeam').value;
      const awayTeam = document.getElementById('awayTeam').value;
      const abbreviationAwayTeam = document.getElementById('abbreviationAwayTeam').value;
      const dateVenue = document.getElementById('dateVenue').value;
      const timeVenueUTC = document.getElementById('timeVenueUTC').value;
      const stadium = document.getElementById('stadium').value;
      const status = document.getElementById('status').value;
      const result = document.getElementById('result').value;
      const stage = document.getElementById('stage').value;
      const competition = document.getElementById('competition').value;
  
      // Format dateVenue for new events
      const formattedDateVenue = new Date(dateVenue).toLocaleDateString('fr', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
  
      // Create a new event object
      const newEvent = {
        homeTeam: {
          name: homeTeam,
          abbreviation: abbreviationHomeTeam,
        },
        awayTeam: {
          name: awayTeam,
          abbreviation: abbreviationAwayTeam,
        },
        dateVenue: formattedDateVenue,
        timeVenueUTC: timeVenueUTC,
        stadium: stadium,
        status: status,
        result: result ? {
          homeGoals: parseInt(result.split('-')[0]) || 0,
          awayGoals: parseInt(result.split('-')[1]) || 0,
          winner: winner || null,
        } : null,
        stage: {
          name: stage || null,
        },
        competition: competition,
      };
  
      // Add the new event to the calendar
      events.push(newEvent);
      generateCalendar(new Date()); // Regenerate the calendar with the updated events
  
      // Reset the form
      addEventForm.reset();
    });
  
    document.getElementById('prevMonth').addEventListener('click', function () {
      const currentMonth = new Date(document.getElementById('calendar').dataset.currentMonth);
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      generateCalendar(currentMonth);
    });
  
    document.getElementById('nextMonth').addEventListener('click', function () {
      const currentMonth = new Date(document.getElementById('calendar').dataset.currentMonth);
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      generateCalendar(currentMonth);
    });
  
    function generateCalendar(targetDate) {
        document.getElementById('calendar').dataset.currentMonth = targetDate.toISOString();
        
        // Set the current month name
        const monthOptions = { month: 'long', year: 'numeric' };
        currentMonthElement.textContent = targetDate.toLocaleDateString('en-US', monthOptions);
    
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
      // Clear previous calendar
      calendarContainer.innerHTML = '';
  
      // Create day headers
      daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('day');
        dayHeader.textContent = day;
        calendarContainer.appendChild(dayHeader);
      });
  
      // Get the first day of the month and the last day of the month
      const firstDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      const lastDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
  
      // Create days for the entire month
      for (let currentDay = new Date(firstDayOfMonth); currentDay <= lastDayOfMonth; currentDay.setDate(currentDay.getDate() + 1)) {
        const dayContainer = document.createElement('div');
        dayContainer.classList.add('day');
  
        // Get all events on the current day
        const eventsOnCurrentDay = events.filter(event => {
          const eventDate = new Date(event.dateVenue);
          return eventDate.getDate() === currentDay.getDate() &&
                 eventDate.getMonth() === currentDay.getMonth() &&
                 eventDate.getFullYear() === currentDay.getFullYear();
        });
  
        // Display information for all events on the current day
        eventsOnCurrentDay.forEach(event => {
          if (event.status === 'played') {
            const eventButton = document.createElement('button');
            eventButton.classList.add('played');
            eventButton.textContent = `${event.homeTeam.abbreviation} ${event.result.homeGoals}  - ${event.result.awayGoals} ${event.awayTeam.abbreviation}`;
            eventButton.addEventListener('click', () => showEventDetail(event));
            dayContainer.appendChild(eventButton);
          } else if (event.status === "scheduled") {
            if (event.homeTeam) {
              const eventButton = document.createElement('button');
              eventButton.classList.add('scheduled');
              eventButton.textContent = `${event.homeTeam.abbreviation} vs ${event.awayTeam.abbreviation}`;
              eventButton.addEventListener('click', () => showEventDetail(event));
              dayContainer.appendChild(eventButton);
            } 
            else {
              const eventButton = document.createElement('button');
              eventButton.classList.add('scheduled');
              eventButton.textContent = `N/A vs ${event.awayTeam.abbreviation}`;
              eventButton.addEventListener('click', () => showEventDetail(event));
              dayContainer.appendChild(eventButton);
            }
          }
        });
  
        // If there are no events on the current day, display the day number
        if (eventsOnCurrentDay.length === 0) {
          dayContainer.textContent = currentDay.getDate();
        }
  
        calendarContainer.appendChild(dayContainer);
      }
    }
  
    function showEventDetail(event) {
      // Redirect to the detail page with event details in the URL
      const detailUrl = `detail.html?homeTeam=${encodeURIComponent(event.homeTeam ? event.homeTeam.name : 'N/A')}&awayTeam=${encodeURIComponent(event.awayTeam.name)}&dateVenue=${encodeURIComponent(event.dateVenue)}&timeVenueUTC=${encodeURIComponent(event.timeVenueUTC)}&stadium=${encodeURIComponent(event.stadium || 'N/A')}&result=${encodeURIComponent(event.result ? `${event.result.homeGoals} - ${event.result.awayGoals}` : 'N/A')}&stage=${encodeURIComponent(event.stage ? event.stage.name : 'N/A')}&competition=${encodeURIComponent(event.competition)}`;
      window.location.href = detailUrl;
    }
  });
  