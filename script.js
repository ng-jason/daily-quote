document.addEventListener('DOMContentLoaded', function() {
    // Set date picker to today's date
    const datePicker = document.getElementById('date-picker');
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // Fetch quotes from a .json file
    fetch('quotes.json')
        .then(response => response.json())
        .then(data => {
            const quotes = data;

            // Function to get the quote for a given date
            function getQuote(date) {
                // The json file column names are "Date" and "Quote"
                const quote = quotes.find(quote => quote.Date == date).Quote;
                return quote || "No quote available for this date.";
            }

            // Update the textContent of an element by ID with today's quote
            function updateQuote() {
                const selectedDate = datePicker.value;
                const quoteElement = document.getElementById('quote');
                quoteElement.textContent = getQuote(selectedDate);
            }

            // Update the page with today's quote when the page loads
            updateQuote();

            // Event listener to update quote when date changes
            datePicker.addEventListener('change', updateQuote);
        })
        .catch(error => console.error('Error fetching quotes:', error));
});