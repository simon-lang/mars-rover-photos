import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders credit link', () => {
    render(<App />)
    const linkElement = screen.getByText(/simon-lang/i)
    expect(linkElement).toBeInTheDocument()
})
