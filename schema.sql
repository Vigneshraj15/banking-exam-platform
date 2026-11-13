-- ====================================================================
-- Indian Banking Competitive Examination Platform - Database Schema
-- Production PostgreSQL DDL Architecture
-- Supports: SBI PO/Clerk/SO, IBPS PO/Clerk/RRB, RBI Grade B/Assistant, NABARD
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerations
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'FACULTY', 'CONTENT_CREATOR', 'STUDENT');
CREATE TYPE exam_status AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'ARCHIVED');
CREATE TYPE attempt_status AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'TIMED_OUT', 'TERMINATED_VIOLATION');
CREATE TYPE question_type AS ENUM ('SINGLE_CHOICE_MCQ', 'MULTIPLE_SELECT', 'NUMERICAL_VALUE', 'PASSAGE_MCQ', 'PUZZLE_MCQ', 'DI_MCQ');
CREATE TYPE difficulty_level AS ENUM ('EASY', 'MODERATE', 'DIFFICULT', 'EXPERT');
CREATE TYPE question_state AS ENUM ('NOT_VISITED', 'NOT_ANSWERED', 'ANSWERED', 'MARKED_FOR_REVIEW', 'ANSWERED_AND_MARKED');

-- 3. Institutions & Multi-tenant Support
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    role user_role DEFAULT 'STUDENT',
    roll_number VARCHAR(100) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    target_exam VARCHAR(100),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Examination Categories (SBI, IBPS, RBI, NABARD, etc.)
CREATE TABLE exam_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    conducting_body VARCHAR(150) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subjects (Quant, Reasoning, English, GA, Computer Aptitude)
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0
);

-- 7. Topics (Simplification, Puzzles, Reading Comprehension, Banking Awareness, etc.)
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    recommended_time_seconds INT DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Subtopics
CREATE TABLE subtopics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL
);

-- 9. Question Groups (Passages, Puzzles, Seating Arrangements, DI Tables/Charts)
CREATE TABLE question_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    group_type VARCHAR(50) NOT NULL, -- 'READING_COMPREHENSION', 'FLOOR_PUZZLE', 'CIRCULAR_SEATING', 'DATA_INTERPRETATION_TABLE'
    passage_text TEXT NOT NULL,
    dataset_json JSONB,
    diagram_url TEXT,
    context_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Centralized Question Bank
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    topic_id UUID NOT NULL REFERENCES topics(id),
    subtopic_id UUID REFERENCES subtopics(id),
    question_group_id UUID REFERENCES question_groups(id) ON DELETE SET NULL,
    question_type question_type DEFAULT 'SINGLE_CHOICE_MCQ',
    difficulty difficulty_level DEFAULT 'MODERATE',
    statement TEXT NOT NULL,
    has_math_formula BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    default_positive_marks NUMERIC(4,2) DEFAULT 1.00,
    default_negative_marks NUMERIC(4,2) DEFAULT 0.25,
    source_exam VARCHAR(100), -- 'SBI PO Prelims 2023', 'IBPS Clerk 2022'
    source_year INT,
    created_by UUID REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Question Options (5 Options: A, B, C, D, E typical in banking exams)
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_key CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D', 'E'
    content TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order_index INT NOT NULL,
    CONSTRAINT unique_option_per_question UNIQUE (question_id, option_key)
);

-- 12. Solutions & Detailed Explanations
CREATE TABLE solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID UNIQUE NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    step_by_step_explanation TEXT NOT NULL,
    shortcut_method TEXT,
    key_formula TEXT,
    reasoning_deduction_steps JSONB, -- For step-by-step table/grid in puzzles
    incorrect_options_explanation JSONB,
    video_solution_url TEXT,
    verified_by_faculty_id UUID REFERENCES users(id),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Examinations (SBI PO Prelims Mock #1, IBPS PO Mains Full Test, etc.)
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES exam_categories(id),
    title VARCHAR(255) NOT NULL,
    exam_code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_minutes INT NOT NULL, -- e.g. 60 min for Prelims, 180 min for Mains
    has_sectional_timing BOOLEAN DEFAULT TRUE,
    allow_sectional_switching BOOLEAN DEFAULT FALSE,
    total_marks NUMERIC(6,2) NOT NULL,
    total_questions INT NOT NULL,
    overall_qualifying_marks NUMERIC(6,2),
    estimated_cutoff_general NUMERIC(6,2),
    estimated_cutoff_obc NUMERIC(6,2),
    estimated_cutoff_sc_st NUMERIC(6,2),
    estimated_cutoff_ews NUMERIC(6,2),
    status exam_status DEFAULT 'ACTIVE',
    start_window TIMESTAMP WITH TIME ZONE,
    end_window TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Exam Sections (e.g. English Language 20m, Quant 20m, Reasoning 20m)
CREATE TABLE exam_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    title VARCHAR(150) NOT NULL,
    section_order INT NOT NULL,
    duration_minutes INT NOT NULL,
    positive_marks_per_q NUMERIC(4,2) DEFAULT 1.00,
    negative_marks_per_q NUMERIC(4,2) DEFAULT 0.25,
    sectional_qualifying_marks NUMERIC(4,2),
    total_questions INT NOT NULL,
    CONSTRAINT unique_section_order UNIQUE (exam_id, section_order)
);

-- 15. Mapping Questions to Exam Sections
CREATE TABLE exam_section_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES exam_sections(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    question_order INT NOT NULL,
    positive_marks NUMERIC(4,2) NOT NULL,
    negative_marks NUMERIC(4,2) NOT NULL,
    CONSTRAINT unique_exam_question_order UNIQUE (section_id, question_order)
);

-- 16. Exam Attempts (Candidate Test Sessions)
CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id),
    user_id UUID NOT NULL REFERENCES users(id),
    status attempt_status DEFAULT 'IN_PROGRESS',
    current_section_id UUID REFERENCES exam_sections(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    server_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    score_obtained NUMERIC(6,2) DEFAULT 0.00,
    total_correct INT DEFAULT 0,
    total_incorrect INT DEFAULT 0,
    total_unattempted INT DEFAULT 0,
    accuracy_percentage NUMERIC(5,2) DEFAULT 0.00,
    calculated_percentile NUMERIC(5,2),
    all_india_rank INT,
    total_cohort_count INT,
    is_evaluated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Student Responses (Tracks each question's selected answer & time)
CREATE TABLE student_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    selected_option_id UUID REFERENCES question_options(id),
    state question_state DEFAULT 'NOT_VISITED',
    time_spent_seconds INT DEFAULT 0,
    is_correct BOOLEAN DEFAULT FALSE,
    marks_awarded NUMERIC(4,2) DEFAULT 0.00,
    last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_response_per_attempt_q UNIQUE (attempt_id, question_id)
);

-- 18. Examination Security & Violation Audit Logs
CREATE TABLE exam_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    violation_type VARCHAR(50) NOT NULL, -- 'FULLSCREEN_EXIT', 'TAB_SWITCH', 'FOCUS_LOSS', 'KEYBOARD_LOCKOUT'
    details TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. PDF Uploads and Processing Log
CREATE TABLE question_paper_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploaded_by UUID REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    exam_category_id UUID REFERENCES exam_categories(id),
    target_subject_id UUID REFERENCES subjects(id),
    extraction_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'EXTRACTED_REVIEW_REQUIRED', 'APPROVED'
    total_questions_extracted INT DEFAULT 0,
    confidence_score NUMERIC(4,2),
    raw_extracted_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Student Performance Analytics Snapshots
CREATE TABLE analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    snapshot_date DATE DEFAULT CURRENT_DATE,
    total_tests_taken INT DEFAULT 0,
    avg_score NUMERIC(6,2),
    highest_score NUMERIC(6,2),
    avg_accuracy NUMERIC(5,2),
    strong_topics JSONB,
    weak_topics JSONB,
    speed_accuracy_quadrant JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Indexes for Ultra-Fast Queries & High Concurrency
CREATE INDEX idx_questions_subject_topic ON questions (subject_id, topic_id);
CREATE INDEX idx_questions_difficulty ON questions (difficulty);
CREATE INDEX idx_exam_sections_exam ON exam_sections (exam_id, section_order);
CREATE INDEX idx_attempts_user_exam ON exam_attempts (user_id, exam_id);
CREATE INDEX idx_attempts_status ON exam_attempts (status);
CREATE INDEX idx_student_responses_attempt ON student_responses (attempt_id);
CREATE INDEX idx_student_responses_q ON student_responses (question_id);
