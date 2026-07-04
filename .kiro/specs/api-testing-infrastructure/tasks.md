# Implementation Plan: API Testing Infrastructure

## Overview

This implementation plan establishes a comprehensive automated testing infrastructure for all backend API endpoints in the Express + Prisma system. The plan uses JavaScript/Node.js with Jest as the test runner, Supertest for API testing, fast-check for property-based testing, and mocks for external services. The implementation follows an incremental approach: foundation setup, test utilities, integration tests for each endpoint, property-based tests, and finally reporting/CI integration.

## Tasks

- [ ] 1. Set up test framework foundation and configuration
  - [ ] 1.1 Install and configure Jest test runner
    - Install Jest, Supertest, fast-check, and related dependencies
    - Create `jest.config.js` with test environment settings
    - Configure test database connection using `DATABASE_URL_TEST` environment variable
    - Set test timeout to 10s for integration tests
    - Enable parallel execution with 2 workers
    - Configure coverage collection with 80% threshold for statements/functions/lines, 75% for branches
    - _Requirements: 1.1, 1.2, 1.3, 1.6_
  
  - [ ] 1.2 Create test database management infrastructure
    - Implement `tests/helpers/database.js` with `initTestDatabase`, `runMigrations`, `startTransaction`, `rollbackTransaction`, `clearAllData`, `closeDatabase` functions
    - Configure transaction-based isolation for tests
    - Set up database connection using Prisma test instance
    - Implement global setup hook to initialize test database
    - Implement global teardown hook to close database connections
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_
  
  - [ ] 1.3 Create test configuration module
    - Implement `tests/config/setup.js` with `setupTestDatabase`, `teardownTestDatabase`, `getTestConfig`, `setupGlobalMocks` functions
    - Define test configuration object with database URL, JWT secret, timeouts, parallel workers
    - Register Jest global setup and teardown hooks
    - _Requirements: 1.1, 1.3, 2.1, 2.4_

- [ ] 2. Implement test fixtures and helpers
  - [ ] 2.1 Create test fixtures module
    - Implement `tests/fixtures/index.js` with `createTestUser`, `createTestBooking`, `createTestJob`, `createTestBlogPost`, `createTestTool`, `seedDatabase`, `clearDatabase`, `getAuthToken` functions
    - Define default fixture data for user, booking, job, blog post, tool with realistic Arabic text
    - Implement fixture override mechanism for test-specific variations
    - Generate JWT tokens for authenticated test contexts
    - _Requirements: 2.4, 3.1, 3.7, 4.1, 5.1, 6.1, 7.1_
  
  - [ ] 2.2 Create API test helper module
    - Implement `tests/helpers/api.js` with `makeRequest`, `authenticatedRequest`, `expectSuccess`, `expectError`, `expectValidationError` functions
    - Wrap Supertest to provide common request patterns
    - Implement authenticated request wrapper that adds JWT token headers
    - Create assertion helpers for success, error, and validation error responses
    - _Requirements: 1.4, 1.5, 1.6, 3.5_
  
  - [ ] 2.3 Create mock service manager
    - Implement `tests/mocks/services.js` with `mockWhatsApp`, `mockFileStorage`, `setupMocks`, `resetAllMocks` functions
    - Mock WhatsApp API with `sendMessage`, `sendNotification`, `reset`, `getCallHistory` methods
    - Mock file storage with `upload`, `delete`, `exists`, `reset` methods
    - Configure default success responses for mocks
    - Track mock invocations for test assertions
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 3. Implement contract validators
  - [ ] 3.1 Create contract validation module
    - Implement `tests/validators/contracts.js` with validation functions for all endpoint response schemas
    - Create `validateAuthLoginResponse`, `validateBookingResponse`, `validateJobResponse`, `validateBlogPostResponse`, `validateToolResponse`, `validateProfileResponse`, `validateWorkingHoursResponse`, `validateErrorResponse` functions
    - Implement schema validation logic to check required fields, data types, nested objects
    - Return validation results with `valid` boolean and `errors` array
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [ ]* 3.2 Write unit tests for contract validators
    - Test validator functions with valid and invalid response objects
    - Test detection of missing required fields, wrong data types, unexpected fields
    - Verify validation error messages are descriptive
    - _Requirements: 12.3, 12.4, 12.5_

- [ ] 4. Implement authentication API integration tests
  - [ ] 4.1 Create authentication test suite
    - Implement `tests/integration/auth.test.js` with test cases for login, registration, token validation
    - Test valid login with correct credentials returns JWT token
    - Test invalid login with wrong credentials returns 401 error
    - Test registration with valid data creates user and returns success
    - Test registration with duplicate email returns 400 error
    - Test authenticated request with valid token succeeds
    - Test authenticated request with invalid/expired token returns 401 error
    - Validate response contracts using contract validators
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 11.4, 11.7_
  
  - [ ]* 4.2 Write property test for authentication token lifecycle
    - **Property: Token validity preservation**
    - **Validates: Requirements 3.7, 13.4**
    - Use fast-check to generate valid credentials
    - For all valid credentials, verify: login → receive token → use token → access granted
    - Verify token expiry is respected
    - _Requirements: 3.7, 13.4_

- [ ] 5. Implement bookings API integration tests
  - [ ] 5.1 Create bookings test suite
    - Implement `tests/integration/bookings.test.js` with test cases for CRUD operations
    - Test valid booking creation returns booking object
    - Test booking with invalid date format returns 400 error
    - Test booking with past date is rejected
    - Test authenticated admin retrieval of all bookings
    - Test booking update persists changes
    - Test booking deletion removes from database
    - Validate response contracts using contract validators
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 11.4, 11.7_
  
  - [ ]* 5.2 Write property test for booking CRUD sequence
    - **Property: CRUD consistency**
    - **Validates: Requirements 4.7, 13.6**
    - Use fast-check to generate valid booking data
    - For all valid bookings, verify: create → read → update → read shows updated data
    - Verify date validation invariants
    - _Requirements: 4.7, 13.6_
  
  - [ ]* 5.3 Write property test for booking date validation
    - **Property: Date ordering constraint**
    - **Validates: Requirements 4.3, 13.3**
    - Use fast-check to generate booking date ranges
    - For all date ranges, verify start date is before or equal to end date after validation
    - Verify past dates are rejected
    - _Requirements: 4.3, 13.3_

- [ ] 6. Implement jobs API integration tests
  - [ ] 6.1 Create jobs test suite
    - Implement `tests/integration/jobs.test.js` with test cases for job application submission and CV upload
    - Test valid job application with CV upload creates application
    - Test job application without required fields returns 400 error with field messages
    - Test job application with invalid CV file type is rejected
    - Test authenticated admin retrieval of all job applications
    - Test job application status update persists new status
    - Test CV file access serves file correctly
    - Validate response contracts using contract validators
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 11.4, 11.7_
  
  - [ ]* 6.2 Write property test for file upload validation
    - **Property: File size consistency**
    - **Validates: Requirements 5.7, 13.5**
    - Use fast-check to generate valid file upload scenarios
    - For all valid uploads, verify: upload → retrieve → size matches original
    - Verify file type validation
    - _Requirements: 5.7, 13.5_

- [ ] 7. Implement blog API integration tests
  - [ ] 7.1 Create blog test suite
    - Implement `tests/integration/blog.test.js` with test cases for blog post CRUD and slug generation
    - Test valid blog post creation returns post object
    - Test blog post without title returns 400 error
    - Test blog post creation generates unique slug from title
    - Test duplicate slug generates unique variant
    - Test blog post retrieval by slug returns correct post
    - Test blog post update persists changes
    - Test blog post publishing sets status and timestamp
    - Validate response contracts using contract validators
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 11.4, 11.7_
  
  - [ ]* 7.2 Write property test for slug generation uniqueness
    - **Property: Slug uniqueness invariant**
    - **Validates: Requirements 6.9, 13.2**
    - Use fast-check to generate pairs of blog post titles
    - For all title pairs, verify generated slugs are unique
    - Verify slug generation preserves semantic content
    - _Requirements: 6.9, 13.2_
  
  - [ ]* 7.3 Write property test for blog CRUD sequence
    - **Property: CRUD consistency**
    - **Validates: Requirements 6.8, 13.6**
    - Use fast-check to generate valid blog post data
    - For all valid posts, verify: create → retrieve by slug → equivalent data
    - _Requirements: 6.8, 13.6_

- [ ] 8. Checkpoint - Verify core API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement tools, profile, working hours API integration tests
  - [ ] 9.1 Create tools test suite
    - Implement `tests/integration/tools.test.js` with test cases for tool management CRUD
    - Test valid tool creation returns tool object
    - Test tool without name returns 400 error
    - Test tools retrieval returns all tools
    - Test tool update persists changes
    - Test tool deletion removes tool
    - Validate response contracts using contract validators
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 11.4, 11.7_
  
  - [ ] 9.2 Create profile test suite
    - Implement `tests/integration/profile.test.js` with test cases for profile data retrieval and updates
    - Test profile data retrieval returns current profile
    - Test profile update persists changes and returns updated profile
    - Test profile update with invalid email returns 400 error
    - Test unauthenticated profile update returns 401 error
    - Validate response contracts using contract validators
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 11.4, 11.5, 11.7_
  
  - [ ] 9.3 Create working hours test suite
    - Implement `tests/integration/workingHours.test.js` with test cases for schedule management
    - Test working hours retrieval returns current schedule
    - Test working hours update persists new schedule
    - Test working hours with invalid time format returns 400 error
    - Test working hours with end before start returns validation error
    - Validate response contracts using contract validators
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 11.4, 11.7_
  
  - [ ]* 9.4 Write property test for working hours time validation
    - **Property: Time ordering constraint**
    - **Validates: Requirements 9.4, 9.5**
    - Use fast-check to generate working hour time slots
    - For all time slots, verify end time is after start time after validation
    - Verify invalid time formats are rejected
    - _Requirements: 9.4, 9.5_

- [ ] 10. Implement upload API integration tests
  - [ ] 10.1 Create upload test suite
    - Implement `tests/integration/upload.test.js` with test cases for file upload validation and storage
    - Test valid file upload stores file and returns file path
    - Test file exceeding size limit returns 413 error
    - Test file with unsupported type returns 400 error
    - Test uploaded file access via returned path serves original content
    - Validate response contracts using contract validators
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.4, 11.7_
  
  - [ ]* 10.2 Write property test for upload file content preservation
    - **Property: Content preservation**
    - **Validates: Requirements 10.5, 13.5**
    - Use fast-check to generate valid file uploads
    - For all valid files, verify: upload → access via path → content matches original
    - _Requirements: 10.5, 13.5_

- [ ] 11. Implement error handling integration tests
  - [ ] 11.1 Create error handling test suite
    - Implement `tests/integration/errorHandling.test.js` with test cases for all error scenarios
    - Test malformed JSON returns 400 error with descriptive message
    - Test non-existent endpoint returns 404 error
    - Test database operation failure returns 500 error without internal details
    - Test validation error returns 400 with field error messages
    - Test authorization error returns 403 error
    - Test resource not found returns 404 error with clear message
    - Verify all error responses include `success: false` and `message` fields
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  
  - [ ]* 11.2 Write unit tests for error response format
    - Test error response structure matches error schema
    - Test error messages are descriptive and actionable
    - Test error codes match HTTP status codes
    - _Requirements: 11.7_

- [ ] 12. Implement property generators for property-based tests
  - [ ] 12.1 Create property generators module
    - Implement `tests/properties/generators.js` with fast-check arbitraries for all domain models
    - Create generators: `validEmail`, `validPassword`, `validBookingDate`, `validBookingTime`, `validBlogTitle`, `validSlug`, `validFileName`, `validFileSize`, `validWorkingHourSlot`
    - Create compound generators: `validBooking`, `validJob`, `validBlogPost`
    - Bias generators toward realistic data (not random garbage)
    - Include boundary values and edge cases
    - Generate both ASCII and Arabic text for i18n testing
    - Support dependent values (e.g., start time before end time)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [ ]* 12.2 Write unit tests for property generators
    - Test generators produce valid outputs according to constraints
    - Test generators cover edge cases and boundary values
    - Test generators produce diverse outputs across multiple runs
    - _Requirements: 13.1_

- [ ] 13. Checkpoint - Verify all integration and property tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement performance testing utilities
  - [ ] 14.1 Create performance test helper module
    - Implement `tests/helpers/performance.js` with `measureResponseTime`, `runConcurrent`, `expectResponseTime` functions
    - Implement response time measurement for individual requests
    - Implement concurrent request execution with result aggregation
    - Calculate performance metrics: total requests, successful/failed requests, avg/min/max response times
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [ ] 14.2 Add performance tests to critical endpoints
    - Add performance assertions to authentication login test
    - Add performance assertions to bookings retrieval test
    - Add performance assertions to blog post retrieval test
    - Flag endpoints exceeding 200ms for simple queries
    - Test concurrent requests to critical endpoints
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [ ]* 14.3 Write performance test suite for load testing
    - Implement `tests/performance/load.test.js` with load test scenarios
    - Test concurrent booking creation under load
    - Test concurrent authentication requests under load
    - Test concurrent blog post retrieval under load
    - _Requirements: 14.3_

- [ ] 15. Implement test reporting and CI configuration
  - [ ] 15.1 Configure test reporting
    - Configure Jest to generate human-readable test reports showing passed/failed/skipped tests
    - Configure Jest to exit with non-zero code on test failure
    - Configure coverage reporter to generate HTML and JSON reports
    - Set up watch mode for development
    - Configure test file filtering for running specific suites
    - Enhance error messages with stack traces and request/response details
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_
  
  - [ ] 15.2 Create CI integration configuration
    - Create npm scripts in `package.json` for running tests: `test`, `test:watch`, `test:coverage`, `test:ci`
    - Document test execution commands in README
    - Configure coverage thresholds to fail CI if coverage drops below 80%
    - _Requirements: 1.7, 15.1, 15.2, 15.3_
  
  - [ ]* 15.3 Create test documentation
    - Document test infrastructure architecture in `tests/README.md`
    - Document how to write new tests
    - Document how to run tests locally and in CI
    - Document troubleshooting common test failures
    - _Requirements: 15.5, 15.6_

- [ ] 16. Final integration and validation
  - [ ] 16.1 Run complete test suite and verify all tests pass
    - Execute full test suite with coverage reporting
    - Verify all integration tests pass
    - Verify all property tests pass
    - Verify coverage meets 80% threshold
    - Fix any failing tests or coverage gaps
    - _Requirements: 1.7, 15.2_
  
  - [ ] 16.2 Validate test database isolation
    - Verify tests can run in parallel without conflicts
    - Verify transaction rollback isolates test data
    - Verify tests don't affect production database
    - Verify tests can run repeatedly without manual cleanup
    - _Requirements: 2.1, 2.2, 2.5, 2.6_
  
  - [ ] 16.3 Validate mock service integration
    - Verify WhatsApp mock tracks all calls correctly
    - Verify file storage mock handles all operations
    - Verify mocks reset between tests
    - Verify mocks support failure scenarios
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 17. Final checkpoint - Complete test infrastructure validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at reasonable breaks
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- Integration tests validate complete API workflows with database operations
- The test infrastructure uses JavaScript/Node.js with Jest, Supertest, fast-check, and Prisma
- All tests use transaction-based isolation to avoid affecting production data
- External services (WhatsApp, file storage) are mocked for reliable testing
- Coverage threshold is set to 80% for statements/functions/lines, 75% for branches

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "3.1"] },
    { "id": 2, "tasks": ["3.2", "4.1", "12.1"] },
    { "id": 3, "tasks": ["4.2", "5.1", "6.1", "7.1", "12.2"] },
    { "id": 4, "tasks": ["5.2", "5.3", "6.2", "7.2", "7.3", "9.1", "9.2", "9.3", "10.1"] },
    { "id": 5, "tasks": ["9.4", "10.2", "11.1"] },
    { "id": 6, "tasks": ["11.2", "14.1"] },
    { "id": 7, "tasks": ["14.2", "14.3", "15.1"] },
    { "id": 8, "tasks": ["15.2", "15.3"] },
    { "id": 9, "tasks": ["16.1", "16.2", "16.3"] }
  ]
}
```
