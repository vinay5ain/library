const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const User = require('../models/User');
const { authenticate, authorizeRole } = require('../middleware/auth');

// Issue a book
router.post('/', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { studentId, bookId, issueDate, dueDate } = req.body;
    // Decrement book quantity
    const book = await Book.findById(bookId);
    if (!book || book.quantity < 1) return res.status(400).json({ message: 'Book not available' });
    book.quantity -= 1;
    await book.save();
    // Create issue record
    const issue = new Issue({
      student: studentId,
      book: bookId,
      issueDate,
      dueDate,
      status: 'issued',
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Return a book
router.put('/:id/return', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue || issue.status === 'returned') return res.status(404).json({ message: 'Issue not found or already returned' });
    issue.returnDate = new Date();
    // Calculate fine if overdue
    const now = new Date();
    let fine = 0;
    if (now > issue.dueDate) {
      const daysOverdue = Math.ceil((now - issue.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysOverdue * 5;
      issue.status = 'overdue';
    } else {
      issue.status = 'returned';
    }
    issue.fine = fine;
    await issue.save();
    // Increment book quantity
    const book = await Book.findById(issue.book);
    if (book) {
      book.quantity += 1;
      await book.save();
    }
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all issued books
router.get('/', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const issues = await Issue.find().populate('student').populate('book');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 