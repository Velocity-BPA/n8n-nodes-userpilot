# n8n-nodes-userpilot

> **NOTICE:** This software is licensed under the Business Source License 1.1 (BSL-1.1).  
> Commercial use requires a separate commercial license from Velocity BPA.  
> Contact: licensing@velobpa.com

This is an n8n community node for [UserPilot](https://userpilot.com/), the product growth and user onboarding platform.

UserPilot helps product teams increase user adoption through targeted in-app experiences, surveys, and analytics without code changes.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

To use this node, you need a UserPilot API token:

1. Log in to your UserPilot account
2. Navigate to Settings > Environment Page
3. Copy your API Token (also called Write Token)
4. Create credentials in n8n using this token

For Enterprise/EU deployments, you can specify a custom endpoint URL.

## Supported Resources (12)

### User
- **Identify** - Identify or create a user
- **Update** - Update user properties
- **Get** - Get user details
- **Delete** - Delete a user
- **List** - List all users
- **Search** - Search users by property
- **Bulk Update** - Batch update multiple users
- **Bulk Import** - Import users from CSV
- **Get Events** - Get user event history
- **Get Flows** - Get user flow interactions
- **Merge** - Merge duplicate users

### Company
- **Identify** - Identify or create a company
- **Update** - Update company properties
- **Get** - Get company details
- **Delete** - Delete a company
- **List** - List all companies
- **Search** - Search companies by property
- **Bulk Update** - Batch update multiple companies
- **Get Users** - Get users in company
- **Get Analytics** - Get company engagement data

### Event
- **Track** - Track a custom event
- **Bulk Track** - Batch track multiple events
- **Bulk Import** - Import events from CSV
- **List Definitions** - List all tracked event types
- **Get Definition** - Get event type details
- **Create Definition** - Define a new event type
- **Get Analytics** - Get event metrics

### Flow
- **List** - List all flows
- **Get** - Get flow details
- **Create** - Create a new flow
- **Update** - Update flow settings
- **Delete** - Delete a flow
- **Trigger** - Trigger a flow for a user
- **Publish** - Publish a flow
- **Unpublish** - Unpublish a flow
- **Get Analytics** - Get flow metrics
- **Duplicate** - Clone a flow

### NPS Survey
- **List** - List all NPS surveys
- **Get** - Get NPS survey details
- **Create** - Create an NPS survey
- **Update** - Update NPS settings
- **Delete** - Delete an NPS survey
- **Get Responses** - Get NPS responses
- **Publish** - Publish a survey
- **Unpublish** - Unpublish a survey
- **Get Analytics** - Get NPS trends
- **Export Data** - Export NPS data

### Checklist
- **List** - List all checklists
- **Get** - Get checklist details
- **Create** - Create a checklist
- **Update** - Update a checklist
- **Delete** - Delete a checklist
- **Publish** - Publish a checklist
- **Unpublish** - Unpublish a checklist
- **Get Analytics** - Get completion metrics
- **Get User Progress** - Get user checklist progress

### Resource Center
- **Get** - Get resource center config
- **Update** - Update resource center
- **List Modules** - List resource center modules
- **Create Module** - Create a module
- **Update Module** - Update a module
- **Delete Module** - Delete a module
- **Reorder Modules** - Reorder modules
- **Get Module Analytics** - Get module engagement

### Segment
- **List** - List all segments
- **Get** - Get segment details
- **Create** - Create a segment
- **Update** - Update a segment
- **Delete** - Delete a segment
- **Get Users** - Get users in segment
- **Get Size** - Get segment member count

### Data Export
- **Create** - Create an export job
- **Get Status** - Check export status
- **Download** - Download export file
- **List** - List export jobs
- **Cancel** - Cancel pending export

### Job
- **Get Status** - Get job status
- **List** - List recent jobs
- **Cancel** - Cancel pending job
- **Retry** - Retry failed job
- **Get Errors** - Get job error details

### Spotlight
- **List** - List all spotlights
- **Get** - Get spotlight details
- **Create** - Create a spotlight
- **Update** - Update a spotlight
- **Delete** - Delete a spotlight
- **Publish** - Publish a spotlight
- **Unpublish** - Unpublish a spotlight
- **Get Analytics** - Get spotlight metrics

### Banner
- **List** - List all banners
- **Get** - Get banner details
- **Create** - Create a banner
- **Update** - Update a banner
- **Delete** - Delete a banner
- **Publish** - Publish a banner
- **Unpublish** - Unpublish a banner
- **Get Analytics** - Get banner metrics

## Trigger Node

The **UserPilot Trigger** node listens for webhook events:

- `user.identified` - New user identified
- `user.updated` - User properties changed
- `event.tracked` - Custom event tracked
- `flow.started` - User started flow
- `flow.completed` - User completed flow
- `flow.dismissed` - User dismissed flow
- `nps.submitted` - NPS response received
- `checklist.completed` - Checklist completed
- `checklist.item.completed` - Checklist item completed
- `segment.entered` - User entered segment
- `segment.exited` - User exited segment

Configure webhooks in your UserPilot dashboard pointing to the webhook URL provided by n8n.

## Rate Limits

- Real-time API: Standard HTTP rate limiting
- Bulk operations: 1,200 rows per minute
- File upload: Max 50 MB, 10,000 rows

## Resources

- [UserPilot Documentation](https://docs.userpilot.com/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## License

This project is licensed under the Business Source License 1.1 (BSL-1.1).

**For commercial use, you must obtain a commercial license from Velocity BPA.**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

Contact: licensing@velobpa.com
