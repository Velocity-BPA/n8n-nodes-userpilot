# n8n-nodes-userpilot

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with UserPilot's user onboarding and product adoption platform. With 5+ resources implemented, it enables automated user journey management, onboarding flow creation, survey deployment, user segmentation, and checklist management through n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![UserPilot](https://img.shields.io/badge/UserPilot-API-orange)
![Onboarding](https://img.shields.io/badge/Onboarding-Automation-green)
![User Journey](https://img.shields.io/badge/User%20Journey-Management-purple)

## Features

- **User Management** - Create, update, and manage user profiles with custom properties and behavioral tracking
- **Onboarding Flows** - Trigger and control interactive product tours and onboarding sequences
- **Dynamic Checklists** - Generate and manage personalized onboarding checklists based on user segments
- **User Segmentation** - Create and manage dynamic user segments for targeted experiences
- **Survey Automation** - Deploy NPS, CSAT, and custom surveys to collect user feedback
- **Event Tracking** - Track custom events and user interactions for behavioral analysis
- **Goal Monitoring** - Set up and monitor user completion goals and milestones
- **Real-time Sync** - Bidirectional data synchronization with external systems and databases

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
| API Token | Your UserPilot API token from Settings > Integrations > API | Yes |
| App ID | Your UserPilot application ID | Yes |
| Environment | Environment (production/staging) | No |

## Resources & Operations

### 1. Users

| Operation | Description |
|-----------|-------------|
| Create | Create a new user profile with custom properties |
| Update | Update existing user information and attributes |
| Get | Retrieve user details and associated data |
| Delete | Remove user from UserPilot |
| List | Get paginated list of users with filtering options |
| Track Event | Record custom events for user behavioral tracking |

### 2. Flows

| Operation | Description |
|-----------|-------------|
| Create | Create new onboarding flow or product tour |
| Update | Modify existing flow content and targeting |
| Get | Retrieve flow details and statistics |
| Delete | Remove flow from account |
| List | Get all flows with filtering and pagination |
| Trigger | Manually trigger flow for specific users |
| Pause | Pause active flow |
| Resume | Resume paused flow |

### 3. Checklists

| Operation | Description |
|-----------|-------------|
| Create | Create new onboarding checklist |
| Update | Modify checklist items and completion criteria |
| Get | Retrieve checklist details and progress |
| Delete | Remove checklist |
| List | Get all checklists with filtering options |
| Mark Complete | Mark checklist item as completed for user |
| Reset Progress | Reset user's checklist progress |

### 4. Segments

| Operation | Description |
|-----------|-------------|
| Create | Create new user segment with targeting rules |
| Update | Modify segment criteria and conditions |
| Get | Retrieve segment details and user count |
| Delete | Remove segment |
| List | Get all segments with pagination |
| Get Users | Retrieve users belonging to specific segment |

### 5. Surveys

| Operation | Description |
|-----------|-------------|
| Create | Create new survey (NPS, CSAT, custom) |
| Update | Modify survey questions and targeting |
| Get | Retrieve survey details and responses |
| Delete | Remove survey |
| List | Get all surveys with filtering options |
| Get Responses | Retrieve survey response data |
| Send | Manually trigger survey for specific users |

## Usage Examples

```javascript
// Create a new user with custom properties
{
  "user_id": "user_12345",
  "email": "john.doe@company.com",
  "created_at": "2024-01-15T10:30:00Z",
  "properties": {
    "name": "John Doe",
    "plan": "pro",
    "company": "Acme Corp",
    "role": "admin"
  }
}
```

```javascript
// Trigger onboarding flow for new user
{
  "flow_id": "flow_abc123",
  "user_id": "user_12345",
  "trigger_type": "manual",
  "context": {
    "feature": "dashboard",
    "plan_type": "pro"
  }
}
```

```javascript
// Create user segment for enterprise customers
{
  "name": "Enterprise Users",
  "description": "Users on enterprise plans",
  "conditions": {
    "AND": [
      {"property": "plan", "operator": "equals", "value": "enterprise"},
      {"property": "created_at", "operator": "greater_than", "value": "30_days_ago"}
    ]
  }
}
```

```javascript
// Deploy NPS survey to specific segment
{
  "type": "nps",
  "title": "How likely are you to recommend our product?",
  "segment_id": "segment_xyz789",
  "schedule": {
    "trigger": "time_based",
    "delay": "7_days"
  },
  "settings": {
    "follow_up_enabled": true,
    "anonymous": false
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API token or App ID | Verify credentials in UserPilot dashboard |
| 403 Forbidden | Insufficient permissions for operation | Check API token permissions and plan limits |
| 404 Not Found | Resource (user, flow, etc.) doesn't exist | Verify resource ID and ensure it exists |
| 429 Rate Limited | Too many API requests | Implement delays between requests |
| 422 Validation Error | Invalid data format or missing required fields | Check payload structure and required fields |
| 500 Server Error | UserPilot service temporarily unavailable | Retry request after delay |

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
- **UserPilot API Documentation**: [UserPilot Developer Docs](https://docs.userpilot.com/api)
- **UserPilot Community**: [UserPilot Help Center](https://help.userpilot.com)