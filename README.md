# Cloud Resume Challenge - Website

Frontend source code for my personal resume website hosted on AWS.

## Live Demo

Visit: [vitraigabor.eu](https://vitraigabor.eu)

## About

This is the frontend component of my Cloud Resume Challenge project - a serverless resume website built on AWS. The website showcases my portfolio, projects, and professional experience.

## Technologies

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with responsive design
- **JavaScript** - Interactive elements and API integration
- **AWS Integration** - View counter using Lambda Function URL

## Features

- Responsive design for all devices
- Dynamic view counter with rate limiting
- Project portfolio with detailed examples
- Professional experience timeline
- Contact information and social links

## Infrastructure

The AWS infrastructure (S3, CloudFront, Route53, Lambda, DynamoDB) is managed separately using Terraform in the [cloud-resume-challenge-iac](https://github.com/gabor-sd/cloud-resume-challenge-iac) repository.

## Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── resources/          # Images and assets
└── .github/            # GitHub Actions workflows
```

## Local Development

Simply open `index.html` in a browser to view locally. The view counter will connect to the live Lambda endpoint.

## Deployment

Deployment is automated via GitHub Actions:
- Push to `main` branch triggers deployment
- Files are synced to S3 bucket
- CloudFront cache is invalidated

## View Counter Implementation

The view counter implements a layered rate limiting approach:
- **Client-side**: `sessionStorage` tracks unique browser sessions
- **Server-side**: IP-based rate limiting (1 increment per hour)
- Prevents spam while maintaining accurate visitor counts

## Author

**Gabor Vitrai**
- Website: [vitraigabor.eu](https://vitraigabor.eu)
