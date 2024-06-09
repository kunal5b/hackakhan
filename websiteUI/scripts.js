document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var container = document.querySelector('.container');
    var events = loadEvents();

    // Initialize the calendar with existing events
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events,
        eventDidMount: function(info) {
            // Create a remove button
            var removeButton = document.createElement('span');
            removeButton.innerHTML = 'X';
            removeButton.style.marginLeft = '10px';
            removeButton.style.cursor = 'pointer';
            removeButton.style.color = 'red';
            removeButton.style.display = 'none';

            // Append the remove button to the event element
            info.el.querySelector('.fc-event-title').append(removeButton);

            // Show the remove button on hover
            info.el.addEventListener('mouseenter', function() {
                removeButton.style.display = 'inline';
            });

            // Hide the remove button when not hovering
            info.el.addEventListener('mouseleave', function() {
                removeButton.style.display = 'none';
            });

            // Remove the event on button click
            removeButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to remove this test?')) {
                    removeEvent(info.event);
                    reload();
                }
            });
        },
        dateClick: function(info) {
            alert('Date clicked: ' + info.dateStr);
        },
        eventClassNames: function(info) {
            if (info.event.title.startsWith('Study for')) {
                return ['study-event'];
            }
            return [];
        }
    });

    calendar.render();

    document.getElementById('addTestButton').addEventListener('click', function() {
        renderAddTestPage();
    });

    document.getElementById('changeAvailabilityButton').addEventListener('click', function() {
        renderAvailabilityPage();
    });

    document.getElementById('adjustPriorityButton').addEventListener('click', function() {
        renderAdjustPriorityPage();
    });

    function reload() {
        location.reload();
    }

    // Function to render the availability page
    function renderAvailabilityPage() {
        container.innerHTML = `
            <h1>Change Availability</h1>
            <form id="availabilityForm">
                <div>
                    <label for="monday">Monday:</label>
                    <input type="number" id="monday" name="monday" min="0" max="24" required>
                </div>
                <div>
                    <label for="tuesday">Tuesday:</label>
                    <input type="number" id="tuesday" name="tuesday" min="0" max="24" required>
                </div>
                <div>
                    <label for="wednesday">Wednesday:</label>
                    <input type="number" id="wednesday" name="wednesday" min="0" max="24" required>
                </div>
                <div>
                    <label for="thursday">Thursday:</label>
                    <input type="number" id="thursday" name="thursday" min="0" max="24" required>
                </div>
                <div>
                    <label for="friday">Friday:</label>
                    <input type="number" id="friday" name="friday" min="0" max="24" required>
                </div>
                <div>
                    <label for="saturday">Saturday:</label>
                    <input type="number" id="saturday" name="saturday" min="0" max="24" required>
                </div>
                <div>
                    <label for="sunday">Sunday:</label>
                    <input type="number" id="sunday" name="sunday" min="0" max="24" required>
                </div>
                <button type="button" id="updateHoursButton">Update Hours</button>
            </form>
            <button id="backButton" class="back-button">Back to Calendar</button>
        `;

        document.getElementById('updateHoursButton').addEventListener('click', function() {
            var form = document.getElementById('availabilityForm');
            var formData = new FormData(form);
            var availability = {};
            var validInput = true;
            formData.forEach((value, key) => {
                availability[key] = value;
                if (value.trim() === '') {
                    validInput = false;
                    return;
                }
                if (value < 0 || isNaN(value)) {
                    validInput = false;
                    return;
                }
            });
            if (!validInput) {
                alert("Please enter a valid number of hours");
                return;
            }
            // Save the availability data to localStorage
            localStorage.setItem('availability', JSON.stringify(availability));
            alert('Availability updated!');
            renderCalendarPage();
        });

        document.getElementById('backButton').addEventListener('click', renderCalendarPage);
    }

    // Function to render the add test page
    function renderAddTestPage() {
        container.innerHTML = `
            <h1>Add Test</h1>
            <form id="testForm">
                <div>
                    <label for="testSubject">Subject:</label>
                    <input type="text" id="testSubject" name="testSubject" required>
                </div>
                <div>
                    <label for="testDay">Day:</label>
                    <input type="number" id="testDay" name="testDay" min="1" max="31" required>
                </div>
                <div>
                    <label for="testMonth">Month:</label>
                    <input type="number" id="testMonth" name="testMonth" min="1" max="12" required>
                </div>
                <div>
                    <label for="testYear">Year:</label>
                    <input type="number" id="testYear" name="testYear" min="2021" max="2100" required>
                </div>
                <button type="button" id="submitTestButton">Submit</button>
            </form>
            <button id="backButton" class="back-button">Back to Calendar</button>
        `;

        document.getElementById('submitTestButton').addEventListener('click', function() {
            var testSubject = document.getElementById('testSubject').value;
            var testDay = document.getElementById('testDay').value;
            var testMonth = document.getElementById('testMonth').value;
            var testYear = document.getElementById('testYear').value;

            var year = parseInt(testYear);
            var month = parseInt(testMonth);
            var day = parseInt(testDay);

            // Validate year, month, and day
            var currentDate = new Date();
            var currentYear = currentDate.getFullYear();
            var currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
            var currentDay = currentDate.getDate();
            var monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                alert('Please enter valid numbers for year, month, and day.');
                return;
            }

            if (year < 2024 || year > 2100 || month < 1 || month > 12 || day < 1) {
                alert('Please enter a valid date.');
                return;
            }

            // Adjust for leap year if necessary
            if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
                monthLengths[1] = 29; // Leap year, February has 29 days
            }

            if (day > monthLengths[month - 1]) {
                alert('Please enter a valid day for the selected month.');
                return;
            }

            var events = loadEvents();
            var priority = events.length + 1;
            var eventDate = `${testYear}-${String(testMonth).padStart(2, '0')}-${String(testDay).padStart(2, '0')}`;

            events.push({ title: `Test: ${testSubject}`, start: eventDate, priority: priority });
            localStorage.setItem('events', JSON.stringify(events));
            alert('Test date added!');

            // Render the Adjust Priority page immediately after adding the test
            renderAdjustPriorityPage();

            // Render the calendar page
            renderCalendarPage();
            refreshhours();
            reload();
        });

        document.getElementById('backButton').addEventListener('click', renderCalendarPage);
    }

    // Function to render the calendar page
    function renderCalendarPage() {
        container.innerHTML = `
            <h1>Calendar</h1>
            <div id="calendar"></div>
            <div class="button-container">
                <button id="adjustPriorityButton">Adjust Priority</button>
                <button id="addTestButton">Add Test</button>
                <button id="changeAvailabilityButton">Change Availability</button>
            </div>
        `;

        // Re-initialize the calendar with existing events
        calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
            initialView: 'dayGridMonth',
            events: loadEvents(),
            eventDidMount: function(info) {
                // Create a remove button
                var removeButton = document.createElement('span');
                removeButton.innerHTML = 'X';
                removeButton.style.marginLeft = '10px';
                removeButton.style.cursor = 'pointer';
                removeButton.style.color = 'red';
                removeButton.style.display = 'none';

                // Append the remove button to the event element
                info.el.querySelector('.fc-event-title').append(removeButton);

                // Show the remove button on hover
                info.el.addEventListener('mouseenter', function() {
                    removeButton.style.display = 'inline';
                });

                // Hide the remove button when not hovering
                info.el.addEventListener('mouseleave', function() {
                    removeButton.style.display = 'none';
                });

                // Remove the event on button click
                removeButton.addEventListener('click', function() {
                    if (confirm('Are you sure you want to remove this test?')) {
                        removeEvent(info.event);
                        reload();
                    }
                });
            },
            dateClick: function(info) {
                alert('Date clicked: ' + info.dateStr);
            },
            eventClassNames: function(info) {
                if (info.event.title.startsWith('Study for')) {
                    return ['study-event'];
                }
                return [];
            }
        });

        calendar.render();

        document.getElementById('addTestButton').addEventListener('click', function() {
            renderAddTestPage();
        });

        document.getElementById('changeAvailabilityButton').addEventListener('click', function() {
            renderAvailabilityPage();
        });

        document.getElementById('adjustPriorityButton').addEventListener('click', function() {
            renderAdjustPriorityPage();
        });
    }

    // Function to render the Adjust Priority page
    function renderAdjustPriorityPage() {
        container.innerHTML = `
            <h1>Adjust Priority</h1>
            <div id="priorityList" class="priority-list">
                ${events.filter(event => !event.title.startsWith('Study for')).map((event, index) => `
                    <div class="priority-item" draggable="true" data-id="${index}">
                        <span class="priority-number"></span> ${event.title} - Date(${event.start}) - Priority: ${event.priority = index + 1}
                    </div>
                `).join('')}
            </div>
        `;

        const priorityList = document.getElementById('priorityList');
        const priorityItems = priorityList.querySelectorAll('.priority-item');

        let draggingItem = null;

        priorityItems.forEach(item => {
            item.addEventListener('dragstart', function() {
                draggingItem = item;
                setTimeout(() => {
                    item.style.display = 'none';
                }, 0);
            });

            item.addEventListener('dragend', function() {
                setTimeout(() => {
                    draggingItem.style.display = 'block';
                    draggingItem = null;
                }, 0);
            });

            item.addEventListener('dragover', function(e) {
                e.preventDefault();
            });

            item.addEventListener('dragenter', function(e) {
                e.preventDefault();
                this.style.backgroundColor = 'lightgray';
            });

            item.addEventListener('dragleave', function() {
                this.style.backgroundColor = '';
            });

            item.addEventListener('drop', function() {
                const dropIndex = this.getAttribute('data-id');
                const draggingIndex = draggingItem.getAttribute('data-id');

                if (dropIndex !== draggingIndex) {
                    const dropItemContent = this.innerHTML;
                    this.innerHTML = draggingItem.innerHTML;
                    draggingItem.innerHTML = dropItemContent;

                    // Update the priority in the events array
                    const temp = events[dropIndex];
                    events[dropIndex] = events[draggingIndex];
                    events[draggingIndex] = temp;

                    // Update the priority number in the UI
                    const dropPriorityNumber = this.querySelector('.priority-number');
                    const draggingPriorityNumber = draggingItem.querySelector('.priority-number');
                    const dropPriorityText = dropPriorityNumber.textContent;
                    dropPriorityNumber.textContent = draggingPriorityNumber.textContent;
                    draggingPriorityNumber.textContent = dropPriorityText;
                    // Update local storage
                    localStorage.setItem('events', JSON.stringify(events));
                }
            });
        });

        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Calendar';
        backButton.addEventListener('click', renderCalendarPage);
        backButton.addEventListener('click', function(){
            reload();
        });
        container.appendChild(backButton);
    }

    // Function to load events from localStorage
    function loadEvents() {
        var events = localStorage.getItem('events');
        return events ? JSON.parse(events) : [];
    }

    // Function to remove an event
    function removeEvent(event) {
        var events = loadEvents();
        events = events.filter(e => e.start !== event.startStr || e.title !== event.title);
        localStorage.setItem('events', JSON.stringify(events));
        event.remove();
        alert('Test removed!');
    }

    // Function to sum the total number of available hours until the test day
    function calculateTotalAvailableHours(startDay, testDay) {
        // Initialize total available hours
        let sum = 0;
        // Retrieve availability data from local storage
        const availabilityData = JSON.parse(localStorage.getItem('availability')) || {};
        // Determine the starting day of the week as a number (0-6, where 0 is Sunday)
        let curDay = new Date(startDay).getDay(); // Returns a number from 0 (Sunday) to 6 (Saturday)
        // Loop from startDay to testDay
        let currentDate = new Date(startDay);
        let testDate = new Date(testDay);
        while (currentDate < testDate) {
            const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][curDay];
            // Retrieve availability for the current day
            const availableHours = parseInt(availabilityData[currentDay]) || 0;
            sum += availableHours;
            curDay = (curDay + 1) % 7; // Move to the next day, wrapping around using modulo 7
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
        return sum;
    }

    function updatePriorityScoresAndDistributeHours() {
        var events = loadEvents();
        var availabilityData = JSON.parse(localStorage.getItem('availability')) || {};

        // Filter out old study events
        events = events.filter(event => !event.title.startsWith('Study for'));

        // Calculate priority scores
        events.forEach(event => {
            const totalHours = calculateTotalAvailableHours(new Date(), event.start);
            event.priorityScore = totalHours * event.priority;
        });

        // Sort by priority scores
        events.sort((a, b) => b.priorityScore - a.priorityScore); // Sort in descending order

        // Calculate sum of all priority scores
        const sumPriorityScores = events.reduce((sum, event) => sum + event.priorityScore, 0);

        // Remove tests with a priority score of 0
        events = events.filter(event => event.priorityScore > 0);

        // Normalize priority scores
        events.forEach(event => {
            event.priorityScore /= sumPriorityScores;
        });

        // Distribute hours based on available hours for each day
        const currentDate = new Date();
        for (let i = 0; i < 7; i++) {
            const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][currentDate.getDay()];
            const availableHours = parseInt(availabilityData[dayName]) || 0;

            events.forEach(event => {
                const studyHours = event.priorityScore * availableHours;
                if (studyHours >= 0.33333) {
                    const studyEvent = {
                        title: `Study for ${event.title.split(': ')[1]} (${studyHours.toFixed(2)} hrs)`,
                        start: new Date(currentDate),
                        allDay: false,
                        display: 'block',
                        backgroundColor: 'green'
                    };
                    events.push(studyEvent);
                }
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Save updated events back to localStorage
        localStorage.setItem('events', JSON.stringify(events));
    }

    // Call the function to update priority scores and distribute hours
    updatePriorityScoresAndDistributeHours();
    renderCalendarPage();
});
