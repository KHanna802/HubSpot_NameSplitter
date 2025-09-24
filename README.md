Code to split a single Name field into First Name, Last Name, using complex logic for ethnic last names.  
It also creates a column for confidence level (low, medium, high), whether the name should be reviewed (yes/no)
and name parsing method.

Prefix Removal
- Dr., Prof., Rev., Captain, Miss, Mr., Mrs., Ms., Col., Major
- Handles both with and without periods (Dr. vs Dr)

Suffix Removal
- Jr., Sr., II, III, IV, V, VI
- Professional: PhD, MD, Esq., CPA, RN

Cultural Particles (kept with surname)
- Dutch: van, van der, van den, van de
- Spanish: de, del, de la, de los, de las
- German: von, zu
French: du, des, le, la
- Arabic: al-, el-, ibn, bin
- Scottish/Irish/Scots Irish: Mc, Mac, O'
- Italian: di, da, della, delle

Name Patterns
- Single names (Madonna) - flagged for review
- Hyphenated surnames (Smith-Johnson)
- Two-part names (John Smith) - high confidence
- Three-part names (John Michael Smith) - medium confidence
- Complex 4+ parts (María José García López) - lower confidence

Trigger
- Name is known, Last name is unknown OR Name is known, First Name is unknown

No Inputs

Outputs
- String, firstname
- String, lastname
- Enumeration, name confidence level (L/M/H)
- Boolean, name_needs_review
- String, name_parsing_method
