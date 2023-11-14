$(document).ready(function() {
    // Display the current date at the top of the page
    var currentDate = dayjs().format("dddd, MMMM D, YYYY");
    $("#currentDay").text(currentDate);

    // Set business hours from 9 am to 5 pm
    var startHour = 9;
    var endHour = 17;

    // Generate time blocks for each hour
    for (let hour = startHour; hour <= endHour; hour++) {
        createHourBlock(hour);
    }

    // Function to create an hour block
    function createHourBlock(hour) {
        const timeBlock = $("<div>").addClass("time-block");
        const hourText = hour > 12 ? hour - 12 + " PM" : hour + " AM";

        timeBlock.attr("data-hour", hour);
        timeBlock.html(`
            <div class="hour">${hourText}</div>
            <textarea class="description"></textarea>
            <button class="saveBtn">Save</button>
            <button class="removeBtn">Remove</button>
        `);

        $(".container").append(timeBlock);
        updateBlockStyle(timeBlock);

        // Load saved events from local storage
        const savedEvent = localStorage.getItem(`event_${hour}`);
        if (savedEvent) {
            timeBlock.find(".description").val(savedEvent);
        }

        // Save button click event
        timeBlock.find(".saveBtn").on("click", function() {
            const description = timeBlock.find(".description").val();

            // Save to local storage
            localStorage.setItem(`event_${hour}`, description);
        });

        // Remove button click event
        timeBlock.find(".removeBtn").on("click", function() {
            // Remove the event from local storage and clear the textarea
            localStorage.removeItem(`event_${hour}`);
            timeBlock.find(".description").val("");
        });
    }

    // Function to update time block styles based on current time
    function updateBlockStyle(timeBlock) {
        const currentHour = dayjs().hour();
        const blockHour = parseInt(timeBlock.attr("data-hour"));

        if (blockHour < currentHour) {
            timeBlock.addClass("past");
            timeBlock.find(".description").prop("disabled", true);
        } else if (blockHour === currentHour) {
            timeBlock.addClass("present");
        } else {
            timeBlock.addClass("future");
        }

        // Move the Save and Remove buttons to the end of the column
        timeBlock.find(".saveBtn, .removeBtn").appendTo(timeBlock);
    }

    // Set the height of the buttons to match the height of each column
    $(".saveBtn, .removeBtn").height($(".time-block").height());
});
