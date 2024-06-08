document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function(info) {
            alert('Date clicked: ' + info.dateStr);
        }
    });

    calendar.render();

    document.getElementById('addTestButton').addEventListener('click', function() {
        alert('Add Test button clicked!');
    });

    document.getElementById('changeAvailabilityButton').addEventListener('click', function() {
        alert('Change Availability button clicked!');
    });
});