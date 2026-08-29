import { crmService } from './crmService.js';
class StatusService {
    /**
     * Safe status query with Anti-Enumeration Protection
     * Never leaks whether an application exists if the email or ref code is invalid.
     */
    async checkApplicationStatus(req) {
        const { refCode, email } = req;
        if (!refCode || !email) {
            return {
                success: false,
                message: 'Both reference code and applicant email address are required.'
            };
        }
        const result = await crmService.getLeadStatusByRefAndEmail(refCode, email);
        if (!result.found) {
            // Neutral message to prevent user/email enumeration
            return {
                success: false,
                message: 'No matching application or enquiry found for the provided reference and email combination. Please check your submission confirmation email.'
            };
        }
        return {
            success: true,
            refCode: result.refCode,
            status: result.publicStatus,
            actionRequired: result.actionRequired,
            lastUpdated: result.updatedAt,
            message: 'Application status retrieved successfully.'
        };
    }
}
export const statusService = new StatusService();
