# n8n-nodes-userpilot

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with UserPilot's product adoption platform. This node provides 6 resource types with full CRUD operations, enabling seamless automation of user onboarding, product analytics, feature adoption tracking, and user experience optimization workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![UserPilot](https://img.shields.io/badge/UserPilot-Product%20Adoption-purple)
![User Experience](https://img.shields.io/badge/UX-Optimization-green)
![Analytics](https://img.shields.io/badge/Analytics-Tracking-orange)

## Features

- **Complete User Management** - Create, update, delete, and retrieve user profiles with custom attributes and segmentation
- **Event Tracking & Analytics** - Track custom events, user interactions, and product usage metrics for data-driven insights
- **Flow Automation** - Manage user onboarding flows, feature tours, and guided experiences programmatically
- **Advanced Segmentation** - Create and manage user segments based on behavior, attributes, and engagement patterns
- **Checklist Management** - Build and track user onboarding checklists and feature adoption milestones
- **Survey Operations** - Deploy, manage, and analyze user feedback surveys and NPS campaigns
- **Real-time Sync** - Bidirectional data synchronization between UserPilot and your n8n workflows
- **Enterprise Security** - Secure API key authentication with comprehensive error handling and validation

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-userpilot`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-userpilot
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-userpilot.git
cd n8n-nodes-userpilot
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-userpilot
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your UserPilot API key from Settings → API Keys | Yes |
| Environment | Production or Sandbox environment | Yes |

## Resources & Operations

### 1. User

| Operation | Description |
|-----------|-------------|
| Create | Create a new user profile with custom attributes and properties |
| Get | Retrieve user details by user ID or external ID |
| Update | Update user attributes, properties, and segmentation data |
| Delete | Remove user from UserPilot system |
| List | Get paginated list of users with filtering options |
| Get Activity | Retrieve user activity log and engagement history |

### 2. Event

| Operation | Description |
|-----------|-------------|
| Track | Send custom events to track user actions and behaviors |
| Get | Retrieve specific event details by event ID |
| List | Get paginated list of events with date range filtering |
| Update | Modify event properties and metadata |
| Delete | Remove tracked events from the system |
| Get Analytics | Retrieve event analytics and aggregation data |

### 3. Flow

| Operation | Description |
|-----------|-------------|
| Create | Create new onboarding flows and guided tours |
| Get | Retrieve flow configuration and settings |
| Update | Modify flow steps, triggers, and targeting rules |
| Delete | Remove flows from the system |
| List | Get all flows with filtering by status and type |
| Trigger | Manually trigger flows for specific users or segments |
| Get Stats | Retrieve flow performance metrics and completion rates |

### 4. Segment

| Operation | Description |
|-----------|-------------|
| Create | Create user segments based on attributes and behaviors |
| Get | Retrieve segment configuration and user count |
| Update | Modify segment rules and criteria |
| Delete | Remove segments from the system |
| List | Get all segments with metadata and statistics |
| Get Users | Retrieve users belonging to a specific segment |

### 5. Checklist

| Operation | Description |
|-----------|-------------|
| Create | Create onboarding checklists with custom steps |
| Get | Retrieve checklist configuration and progress tracking |
| Update | Modify checklist items and completion criteria |
| Delete | Remove checklists from the system |
| List | Get all checklists with filtering options |
| Track Progress | Update user progress on checklist items |
| Get Analytics | Retrieve checklist completion analytics |

### 6. Survey

| Operation | Description |
|-----------|-------------|
| Create | Create NPS, CSAT, and custom feedback surveys |
| Get | Retrieve survey configuration and responses |
| Update | Modify survey questions and targeting settings |
| Delete | Remove surveys from the system |
| List | Get all surveys with response statistics |
| Get Responses | Retrieve survey responses with filtering |
| Send | Manually send surveys to users or segments |

## Usage Examples

```javascript
// Track user signup event with custom properties
{
  "event_name": "user_signup",
  "user_id": "user_12345",
  "properties": {
    "source": "organic",
    "plan": "pro",
    "company_size": "50-100"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

```javascript
// Create user segment for high-value customers
{
  "name": "High Value Customers",
  "rules": {
    "and": [
      {"attribute": "plan", "operator": "equals", "value": "enterprise"},
      {"attribute": "mrr", "operator": "greater_than", "value": 500},
      {"attribute": "last_seen", "operator": "within", "value": "7d"}
    ]
  },
  "description": "Enterprise users with high MRR and recent activity"
}
```

```javascript
// Update user attributes for personalization
{
  "user_id": "user_12345",
  "attributes": {
    "role": "admin",
    "company": "Acme Corp",
    "onboarding_completed": true,
    "feature_flags": ["advanced_analytics", "api_access"]
  },
  "last_seen": "2024-01-15T14:25:00Z"
}
```

```javascript
// Create onboarding checklist for new users
{
  "name": "Getting Started Checklist",
  "items": [
    {"title": "Complete profile", "required": true},
    {"title": "Connect data source", "required": true},
    {"title": "Create first dashboard", "required": false},
    {"title": "Invite team members", "required": false}
  ],
  "auto_trigger": true,
  "target_segment": "new_users"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in credentials settings |
| 404 Not Found | User, flow, or resource doesn't exist | Check resource ID and ensure it exists in UserPilot |
| 429 Rate Limited | Too many API requests | Implement delays between requests or reduce frequency |
| 400 Bad Request | Invalid data format or missing required fields | Validate input data and check required parameters |
| 422 Validation Error | Data doesn't meet UserPilot's validation rules | Review field constraints and data types |
| 500 Server Error | UserPilot service temporarily unavailable | Retry request after delay or check service status |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-userpilot/issues)
- **UserPilot API**: [UserPilot Developer Documentation](https://docs.userpilot.com/api)
- **UserPilot Community**: [UserPilot Help Center](https://help.userpilot.com)