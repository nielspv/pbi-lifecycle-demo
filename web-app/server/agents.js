// Mock agents module - in production, this would call actual Copilot agents
export async function runPBIRefiner(pbi) {
  // Simulate agent running
  await new Promise(resolve => setTimeout(resolve, 1000));

  const verdict = pbi.user_story && pbi.acceptance_criteria ? 'Ready' : 'Not Ready';
  
  return {
    verdict,
    checklist: [
      { criterion: 'Clear title and summary', status: 'Met', evidence: pbi.summary ? 'Provided' : 'Missing' },
      { criterion: 'User story', status: pbi.user_story ? 'Met' : 'Missing', evidence: pbi.user_story || 'Missing' },
      { criterion: 'Business value', status: 'Partial', evidence: 'TODO: confirm with team' },
      { criterion: 'Acceptance criteria', status: pbi.acceptance_criteria ? 'Met' : 'Missing', evidence: pbi.acceptance_criteria ? 'Provided' : 'Missing' },
      { criterion: 'Scope boundaries', status: 'Partial', evidence: 'TODO: define' },
      { criterion: 'Dependencies/risks', status: 'Partial', evidence: 'TODO: identify' },
      { criterion: 'Estimate', status: 'Missing', evidence: 'Not provided' },
      { criterion: 'Non-functional needs', status: 'Partial', evidence: 'TODO: define' }
    ],
    questions: [
      'What is the specific business value of this work?',
      'Are there any dependencies or risks?',
      'What is the team estimate in story points?',
      'What are the non-functional requirements (security, performance)?',
      'What is explicitly out of scope?'
    ]
  };
}

export async function runDocWriter(pbi) {
  // Simulate agent running
  await new Promise(resolve => setTimeout(resolve, 2000));

  const markdown = `# ${pbi.title}

## Overview
${pbi.summary}

## User Story
${pbi.user_story}

## Acceptance Criteria
${Array.isArray(pbi.acceptance_criteria) ? pbi.acceptance_criteria.map((ac, i) => `${i + 1}. ${ac}`).join('\n') : pbi.acceptance_criteria}

## Status
Generated on ${new Date().toISOString()}
`;

  return {
    markdown,
    docx: `${pbi.title}.docx`,
    pr_url: 'https://github.com/nielspv/pbi-lifecycle-demo/pull/1',
    message: 'Documentation generated and PR created for review'
  };
}
