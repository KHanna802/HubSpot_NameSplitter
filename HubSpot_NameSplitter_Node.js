exports.main = async (event, callback) => {
  const fullName = event.inputFields['name'] || '';
  
  if (!fullName.trim()) {
    callback({
      outputFields: {
        firstname: '',
        lastname: '',
        name_needs_review: true,
        name_parsing_method: 'empty',
        name_confidence_level: 'Low'
      }
    });
    return;
  }
  
  // Split and clean
  let parts = fullName.trim().split(/\s+/);
  const originalPartCount = parts.length;
  
  // Lists
  const prefixes = ['mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'rev', 'captain', 'capt', 'col', 'major', 'colonel'];
  const suffixes = ['jr', 'sr', 'ii', 'iii', 'iv', 'v', 'vi', 'phd', 'md', 'esq', 'cpa', 'rn'];
  const particles = ['de', 'del', 'de la', 'van', 'van der', 'van den', 'von', 'du', 'al', 'el', 'ibn', 'bin', 'mc', 'mac', 'o\''];
  
  let removedPrefixes = false;
  let removedSuffixes = false;
  
  // Remove prefixes
  while (parts.length > 0) {
    const firstPart = parts[0].toLowerCase().replace(/[.,]/g, '');
    if (prefixes.includes(firstPart)) {
      parts.shift();
      removedPrefixes = true;
    } else {
      break;
    }
  }
  
  // Remove suffixes
  while (parts.length > 0) {
    const lastPart = parts[parts.length - 1].toLowerCase().replace(/[.,]/g, '');
    if (suffixes.includes(lastPart)) {
      parts.pop();
      removedSuffixes = true;
    } else {
      break;
    }
  }
  
  // Determine parsing method and confidence
  let parseMethod = 'standard';
  let confidence = 'High';
  let particleDetected = false;
  
  // Single name check
  if (parts.length === 1) {
    parseMethod = 'single_name';
    confidence = 'Medium';
  }
  
  // Particle detection
  for (let i = 1; i < parts.length; i++) {
    const checkPart = parts[i].toLowerCase();
    if (particles.includes(checkPart)) {
      particleDetected = true;
      parseMethod = 'particle_surname';
      confidence = 'Medium';
      break;
    }
  }
  
  // Hyphenated names
  if (parts.some(part => part.includes('-'))) {
    parseMethod = 'hyphenated';
    confidence = 'Medium';
  }
  
  // Complex names (3+ parts without particles)
  if (parts.length === 3 && !particleDetected) {
    parseMethod = 'three_part_conservative';
    confidence = 'Medium';
  }
  
  if (parts.length >= 4 && !particleDetected) {
    parseMethod = 'complex_multiple_parts';
    confidence = 'Low';
  }
  
  // Adjust confidence for prefixes/suffixes
  if (removedPrefixes || removedSuffixes) {
    confidence = confidence === 'High' ? 'Medium' : confidence;
  }
  
  const firstName = parts[0] || '';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
  
  callback({
    outputFields: {
      firstname: firstName,
      lastname: lastName,
      name_needs_review: confidence === 'Low' || parts.length === 1,
      name_parsing_method: parseMethod,
      name_confidence_level: confidence
    }
  });
};