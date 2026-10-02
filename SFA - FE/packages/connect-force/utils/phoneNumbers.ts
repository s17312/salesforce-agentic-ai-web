export const cleanMobileInput = (input: string | null | undefined) => {
  // Match all digit sequences and join them without any separator
  const cleanedInput = input?.match(/\d+/g)?.join("");
  // Prepend '+' to the joined digit sequences
  return cleanedInput ? `+${cleanedInput}` : input;
};

export const getDialCode = (input: string | null | undefined) => {
  // Check if input contains a space
  if (input && input.includes(" ")) {
    return input.split(" ")[0];
  }
  // Return the input as is if there's no space
  return input;
};