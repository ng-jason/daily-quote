document.addEventListener('DOMContentLoaded', function() {
    // Set date picker to today's date
    const datePicker = document.getElementById('date-picker');
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // random quote button
    const randomButton = document.getElementById('random-button');

    // Fetch quotes from a .json file
    fetch('quotes.json')
        .then(response => response.json())
        .then(data => {
            const quotes = data;

            // get all dates for random quote function
            const dates = quotes.map(quote => quote.date);

            // Function to get the quote for a given date
            function getQuote(date) {
                // The json file column names are "Date" and "Quote"
                const quote = quotes.find(quote => quote.date == date);
                const author = quote.author
                const quoteText = quote.quote
                return [quoteText, author] || ["No quote available for this date.", ""];
            }

            // Update the textContent of an element by ID with today's quote
            function updateQuote() {
                const selectedDate = datePicker.value;
                const quoteElement = document.getElementById('quote');
                const authorElement = document.getElementById('author');
                [quoteElement.textContent, authorElement.textContent] = getQuote(selectedDate);
            }

            // Update the page with today's quote when the page loads
            updateQuote();

            // Event listener to update quote when date changes
            datePicker.addEventListener('change', updateQuote);

            // Event listener to get random quote 
            randomButton.addEventListener('click', () => {
                const randomDate = dates[Math.floor(Math.random() * dates.length)];
                datePicker.value = randomDate;
                updateQuote();
            })
        })
        .catch(error => console.error('Error fetching quotes:', error));
});