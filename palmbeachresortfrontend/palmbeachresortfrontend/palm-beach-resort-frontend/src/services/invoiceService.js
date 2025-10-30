class InvoiceService {
    async getCurrentInvoice() {
        try {
            const response = await fetch('/api/customer/billing/current', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                throw new Error('Authentication required');
            }

            if (response.status === 400) {
                let errorMessage = 'No active booking found';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    // If we can't parse the error response, use default message
                }
                throw new Error(errorMessage);
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch invoice: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching current invoice:', error);
            throw error;
        }
    }

    async getInvoiceByBooking(bookingReference) {
        try {
            const response = await fetch(`/api/customer/billing/booking/${bookingReference}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                throw new Error('Authentication required');
            }

            if (response.status === 400) {
                let errorMessage = 'Invalid booking reference';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    // If we can't parse the error response, use default message
                }
                throw new Error(errorMessage);
            }

            if (response.status === 404) {
                throw new Error('Invoice not found');
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch invoice: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching invoice by booking:', error);
            throw error;
        }
    }

    async downloadInvoicePDF(bookingReference) {
        try {
            const response = await fetch(`/api/customer/billing/download/${bookingReference}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to download PDF: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            console.error('Error downloading invoice PDF:', error);
            throw error;
        }
    }
}

export const invoiceService = new InvoiceService();