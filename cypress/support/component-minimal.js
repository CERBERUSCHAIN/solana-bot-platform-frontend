// cypress/support/component-minimal.js
import React from 'react'
import { mount } from 'cypress/react18'

Cypress.Commands.add('mount', mount)
