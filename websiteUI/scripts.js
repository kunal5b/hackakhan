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
                }
            });
        },
        dateClick: function(info) {
            alert('Date clicked: ' + info.dateStr);
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
    function reload(){
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
        `;

        document.getElementById('updateHoursButton').addEventListener('click', function() {
            var form = document.getElementById('availabilityForm');
            var formData = new FormData(form);
            var availability = {};

            formData.forEach((value, key) => {
                availability[key] = value;
            });

            // Save the availability data to localStorage
            localStorage.setItem('availability', JSON.stringify(availability));
            alert('Availability updated!');
            renderCalendarPage();
        });
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
        `;

        document.getElementById('submitTestButton').addEventListener('click', function() {
            var form = document.getElementById('testForm');
            var formData = new FormData(form);
            var testDate = {};

            formData.forEach((value, key) => {
                testDate[key] = value;
            });

            // Save the test date and subject to localStorage
            var events = loadEvents();
            var eventDate = `${testDate['testYear']}-${String(testDate['testMonth']).padStart(2, '0')}-${String(testDate['testDay']).padStart(2, '0')}`;

            // Calculate the priority for the new test
            var priority = events.length + 1;

            events.push({ title: `Test: ${testDate['testSubject']}`, start: eventDate, priority: priority });

            localStorage.setItem('events', JSON.stringify(events));
            alert('Test date added!');

            // Render the Adjust Priority page immediately after adding the test
            renderAdjustPriorityPage();

            // Render the calendar page
            renderCalendarPage();
            reload();
        });
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
                removeButton.style.margin
                left = '10px';
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
                ${events.map((event, index) => `
                    <div class="priority-item" draggable="true" data-id="${index}">
                        <span class="priority-number">Priority ${index + 1}:</span> ${event.title} - Date(${event.start}) - Priority: ${event.priority}
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
});
