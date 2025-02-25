// get date parameter from URL or use today's date
const params = new URLSearchParams(window.location.search);
const datePicker = document.getElementById('date-picker');
const today = new Date().toISOString().split('T')[0];
datePicker.value = params.get("date") || today;

// random quote button
const randomButton = document.getElementById('random-button');
// prev and next date buttons
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// fetch quotes from a .json file
fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        const quotes = data;

        // get all dates for random quote function
        const dates = quotes.map(quote => quote.date);

        // function to get the quote for a given date
        function getQuote(date) {
            const quote = quotes.find(quote => quote.date == date);
            if (!quote) {
                return ["No quote available for this date.", ""];
            }
            const author = "— " + quote.author;
            const quoteText = quote.quote;
            return [quoteText, author];
        }

        // update the textContent of an element by ID with today's quote
        function updateContent(date) {
            datePicker.value = date;

            const quoteElement = document.getElementById('quote');
            const authorElement = document.getElementById('author');
            const dateElement = document.getElementById('date');
            // update the quote and author texts
            [quoteElement.textContent, authorElement.textContent] = getQuote(date);
            // update the date
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = new Date(date).toLocaleDateString('en-US', options);
        }

        // update the page with today's quote when the page loads
        updateContent(datePicker.value);

        // function to handle date change and update URL
        function handleDateChange(newDate) {
            updateContent(newDate);
            // update the URL without reloading the page
            const newURL = new URL(window.location);
            newURL.searchParams.set("date", newDate);
            history.pushState({ date: newDate }, '', newURL);
        }

        // Event listener to update quote when date-picker value changes
        datePicker.addEventListener('change', () => handleDateChange(datePicker.value));

        // Event listener to get random quote
        randomButton.addEventListener('click', () => {
            const randomDate = dates[Math.floor(Math.random() * dates.length)];
            handleDateChange(randomDate);
        });

        function adjustDate(offset) {
            const date = new Date(datePicker.value);
            date.setDate(date.getDate() + offset);
            const newDate = date.toISOString().split('T')[0];
            handleDateChange(newDate);
        }

        // Event listener for prev and next day's quote button
        prevButton.addEventListener('click', () => adjustDate(-1));
        nextButton.addEventListener('click', () => adjustDate(+1));

        // handle browser back/forward navigation
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.date) {
                updateContent(event.state.date);
            } else {
                updateContent(today);
            }
        });

    })
    .catch(error => {
        console.error('Error fetching quotes:', error);
        document.getElementById('quote').textContent = 'Failed to load quotes';
    });