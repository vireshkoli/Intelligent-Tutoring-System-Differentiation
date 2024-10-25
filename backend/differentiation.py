from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import sympy as sp

app = Flask(__name__)
CORS(app)

def parse_function(function):
    terms = re.findall(r'([+-]?\d*\.?\d*\*?(?:x(?:\^\d+)?|tan\(x\)|cos\(x\)|sin\(x\)|cot\(x\)|sec\(x\)|sec\^2\(x\)|cosec\(x\)|cosec\^2\(x\)|log\(x\)|e\^x|\(1/x\)|a(?:\^\d+)?|sec\(x\)\*tan\(x\)|cosec\(x\)\*cot\(x\)|[a-zA-Z])|[+-]?\d+)', function.replace(' ', ''))

    terms = [term for term in terms if term]  # Remove empty strings
    parsed_terms = []

    for term in terms:
        if 'sin(x)' in term:
            coefficient = term.replace('sin(x)', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'sin(x)', None))
        elif 'cos(x)' in term:
            coefficient = term.replace('cos(x)', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'cos(x)', None))
        elif 'tan(x)' in term:
            coefficient = term.replace('tan(x)', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'tan(x)', None))
        elif 'cosec(x)' in term and 'cosec(x)*cot(x)' not in term:
            coefficient = term.replace('cosec(x)', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'cosec(x)', None))
        elif 'sec(x)' in term and 'sec(x)*tan(x)' not in term:
            coefficient = term.replace('sec(x)', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'sec(x)', None))
        elif 'cot(x)' in term:
            coefficient = term.replace('cot(x)', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'cot(x)', None))
        elif 'log(x)' in term:
            coefficient = term.replace('log(x)', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'log(x)', None))
        elif 'e^x' in term:
            coefficient = term.replace('e^x', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'e^x', None))
        elif '(1/x)' in term:
            coefficient = term.replace('(1/x)', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), '(1/x)', None))
        elif 'a^x' in term:
            coefficient = term.replace('a^x', '').replace('*', '')
            coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
            coefficient = coefficient if coefficient != '-' else '-1'
            parsed_terms.append((int(coefficient), 'a^x', None))
        elif 'x' in term:
            if '^' in term:
                base, exponent = term.split('x^')
                base = base.replace('*', '')  # If the function contains '*'
                coefficient = base if base != '' and base != '+' else '1'
                coefficient = coefficient if coefficient != '-' else '-1'
                parsed_terms.append((int(coefficient), 'x', int(exponent)))
            else:
                coefficient = term.split('x')[0]
                coefficient = coefficient.replace('*', '')
                coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
                coefficient = coefficient if coefficient != '-' else '-1'
                parsed_terms.append((int(coefficient), 'x', 1))
        else:
            parsed_terms.append((int(term), None, 0))

    return parsed_terms

def find_nested_expressions(expression):
    stack = []
    nested_expressions = []
    
    x_pattern = re.compile(r'\(x\)')

    i = 0
    while i < len(expression):
        char = expression[i]
        
        if char == '(':
    
            # Handle cases like (x)
            if i < len(expression) - 2 and expression[i:i+3] == '(x)':
                match = x_pattern.search(expression, i)
                if match:
                    i = match.end()
                    continue
            # Push the index of the '(' onto the stack
            stack.append(i)
        
        elif char == ')':
            # Pop the last '(' from the stack and extract the nested expression
            start = stack.pop()
            if not stack:
                nested_expressions.append((start, i))
        
        i += 1
    
    return nested_expressions

def nested_status(function):
    parts = re.split(r'\s*[+-]\s*', function)
    nested_status = []

    for part in parts:
        part = part.strip()
        if not part:
            continue
        
        # Check for nested expressions
        nested_ranges = find_nested_expressions(part)
        if nested_ranges:
            nested_status.append(True)
        else:
            nested_status.append(False)

    return nested_status

def parse_function_main(function):
    parts = re.split(r'([+-])', function)
    parsed_terms = []

    for part in parts:
        part = part.strip()
        if not part:
            continue
        
        nested_ranges = find_nested_expressions(part)
        if nested_ranges:
            i = 0
            while i < len(part):
                if part[i] == '(':
                    start = i
                    for start, end in nested_ranges:
                        if start == i:
                            break
                    i = end + 1

                    pre_expression = part[:start].strip()
                    post_expression = part[end + 1:].strip()

                    func_name_match = re.search(r'[a-zA-Z]+(?:\^\d*)?', pre_expression)
                    if func_name_match:
                        func_name = func_name_match.group()
                    else:
                        func_name = None

                    coefficient = re.findall(r'[+-]?\d*\.?\d*', pre_expression)
                    coefficient = coefficient[0] if coefficient else '1'
                    coefficient = coefficient if coefficient != '' and coefficient != '+' else '1'
                    coefficient = coefficient if coefficient != '-' else '-1'

                    outer_exponent_match = re.match(r'\^\d+', post_expression)
                    outer_exponent = int(outer_exponent_match.group()[1:]) if outer_exponent_match else None
                    
                    nested_expression = part[start + 1:end]

                    inner_nested = parse_function_main(nested_expression)

                    def flatten_nested_expression(nested_expression):
                        flattened = []
                        for item in nested_expression:
                            if isinstance(item, list):
                                flattened.extend(flatten_nested_expression(item))
                            else:
                                flattened.append(item)
                        return flattened

                    flattened_inner_nested = flatten_nested_expression(inner_nested)

                    if func_name:
                        parsed_terms.append([(int(coefficient), f'{func_name}({nested_expression})',outer_exponent), flattened_inner_nested])
                    else:
                        parsed_terms.append([(int(coefficient), nested_expression, int(outer_exponent)), flattened_inner_nested])

                else:
                    i += 1
        else:
            parsed_terms.extend(parse_function(part))

    return parsed_terms

def apply_differentiation_main(parsed_terms):
    steps = []
    for term in parsed_terms:
        if isinstance(term, tuple):  # Non-nested term 

            coeff, var, exp = term

            if var is None:
                    steps.append("0")

            elif var == 'sin(x)':
                if coeff == 1:
                    steps.append(f"cos(x)")
                else:
                    steps.append(f"{coeff}*cos(x)")
            elif var == 'cos(x)':
                if coeff == 1:
                    steps.append(f"-sin(x)")
                else:
                    steps.append(f"{-coeff}*sin(x)")
            elif var == 'tan(x)':
                if coeff == 1:
                    steps.append(f"sec(x)^2")
                else:
                    steps.append(f"{coeff}*sec(x)^2")
            elif var == 'cosec(x)':
                if coeff == 1:
                    steps.append(f"-cosec(x)*cot(x)")
                else:
                    steps.append(f"{-coeff}*cosec(x)*cot(x)")
            elif var == 'sec(x)':
                if coeff == 1:
                    steps.append(f"sec(x)*tan(x)")
                else:
                    steps.append(f"{coeff}*sec(x)*tan(x)")
            elif var == 'cot(x)':
                if coeff == 1:
                    steps.append(f"-cosec(x)^2")
                else:
                    steps.append(f"{-coeff}*cosec(x)^2")

            elif var == 'log(x)':
                if coeff == 1:
                    steps.append(f"(1/x)")
                else:
                    steps.append(f"{coeff}*(1/x)")

            elif var == 'e^x':
                if coeff == 1:
                    steps.append(f"e^x")
                else:
                    steps.append(f"{coeff}*e^x")

            elif exp == 1:
                steps.append(str(coeff))
            elif exp >= 1:
                new_coeff = coeff * exp
                new_exp = exp - 1
                if new_exp == 1:
                    steps.append(f"{new_coeff}*x")
                else:
                    steps.append(f"{new_coeff}*x^{new_exp}")

        elif isinstance(term, list):  # Nested term

            nested_steps = apply_differentiation_nested(parsed_terms)

            return nested_steps

    return steps

def apply_differentiation_outer(term):
    coefficient, expression, exponent = term

    # Apply power rule to the outer expression
    if exponent is not None:
        new_coefficient = coefficient * exponent 
        new_exponent = exponent - 1 
        if new_exponent == 1:
            outer_derivative = f"{new_coefficient}*({expression})"
        else:
            outer_derivative = f"{new_coefficient}*({expression})^{new_exponent}"
        return outer_derivative
    

    elif expression.startswith('sin'):
        return f"{coefficient}*cos{expression[3:]}"
    elif expression.startswith('cos'):
        return f"-{coefficient}*sin{expression[3:]}"
    elif expression.startswith('tan'):
        return f"{coefficient}*sec{expression[3:]}^2"
    elif expression.startswith('cosec'):
        return f"-{coefficient}*cosec{expression[5:]}*cot{expression[5:]}"
    elif expression.startswith('sec'):
        return f"{coefficient}*sec{expression[3:]}*tan{expression[3:]}"
    elif expression.startswith('cot'):
        return f"-{coefficient}*cosec{expression[3:]}^2"
    elif expression.startswith('log'):
        inner_expr = expression[3:]  # Extract the inner part of log expression
        return f"{coefficient}*(1/{inner_expr[1:-1]})"
    elif expression.startswith('e^'):
        return f"{coefficient}*e^{expression[2:]}"

    return expression  

def apply_differentiation_nested(parsed_terms):
    differentiated_nested = []

    for i, term in enumerate(parsed_terms):
        # If the term is a list, it means it's nested, so we recurse
        if isinstance(term, list):
            outer_term = term[0]
            inner_terms = term[1]
            
            differentiated_outer = apply_differentiation_outer(outer_term)
            
            differentiated_inner = apply_differentiation_nested(inner_terms)
            
            differentiated_nested.append([differentiated_outer, differentiated_inner])
        else:
            # last term, apply main differentiation
            if i == len(parsed_terms) - 1:
                differentiated_nested.append(apply_differentiation_main([term])[0])
            else:
                differentiated_nested.append(apply_differentiation_outer(term))

    return differentiated_nested


import re

def compare_steps_differentiation(student_step, expected_step):
    
    term_pattern = r'[+-]?\d*\.?\d*\*?(?:x(?:\^\d+)?|sec\^2\(x\)|cosec\^2\(x\)|sec\(x\)\*tan\(x\)|cosec\(x\)\*cot\(x\)|sin\(.+\)|cos\(.+\)|tan\(.+\)|cosec\(.+\)|sec\(.+\)|cot\(.+\)|log\(.+\)|e\^x|e\^\(.+\)|0|\(1/x\)|\(.+\)\^\d+)?'

    student_parts = re.findall(term_pattern, student_step)
    expected_parts = re.findall(term_pattern, expected_step)
    print(student_parts, expected_parts)
    
    student_parts = [part for part in student_parts if part]
    expected_parts = [part for part in expected_parts if part]

    if len(student_parts) != len(expected_parts):
        return "Invalid input error: The given input step is not valid."
    
    for sp, ep in zip(student_parts, expected_parts):

        nested_pattern = r'(\d+)?\*?(sin|cos|tan|log|e\^|sec|cosec|cot)\((.+)\)(?:\^\d+)?'
        
        student_nested = re.match(nested_pattern, sp)
        expected_nested = re.match(nested_pattern, ep)

        
        if student_nested and expected_nested:
            student_coeff, student_func, student_inner = student_nested.groups()
            expected_coeff, expected_func, expected_inner = expected_nested.groups()

            if student_coeff != expected_coeff:
                    return f"Coefficient error: Expected {expected_coeff} but got {student_coeff}."
            
            if student_func != expected_func:
                return f"Function error: Expected {expected_func} but got {student_func}."

            # Recursively compare the inner parts of the nested function
            inner_comparison = compare_steps_differentiation(student_inner, expected_inner)
            print(inner_comparison)
            if inner_comparison != "Correct!":
                return f"Inner function error: {inner_comparison}"
            
            # Handle the exponent outside the nested function if present
            student_exponent = re.search(r'\^\d+', sp)
            expected_exponent = re.search(r'\^\d+', ep)
            if student_exponent and expected_exponent:
                student_exp = int(student_exponent.group()[1:])
                expected_exp = int(expected_exponent.group()[1:])
                if student_exp != expected_exp:
                    return f"Exponent error: Expected exponent {expected_exp} but got {student_exp}."
            elif student_exponent and not expected_exponent:
                return f"Exponent error: Unexpected exponent {student_exponent.group()}."
            elif expected_exponent and not student_exponent:
                return f"Exponent error: Missing expected exponent {expected_exponent.group()}."
        
        elif '(' in sp and '(' in ep:
            outer_pattern = r'([+-]?\d*)\*?\((.+)\)\^(\d+)'
            student_outer = re.match(outer_pattern, sp)
            expected_outer = re.match(outer_pattern, ep)
            
            if student_outer and expected_outer:
                student_coeff, student_inner, student_exp = student_outer.groups()
                expected_coeff, expected_inner, expected_exp = expected_outer.groups()

                student_coeff = int(student_coeff) if student_coeff else 1
                expected_coeff = int(expected_coeff) if expected_coeff else 1
                print("Helllo", student_coeff, expected_coeff)
                if student_coeff != expected_coeff:
                    return f"Coefficient error: Expected {expected_coeff} but got {student_coeff}."

                inner_comparison = compare_steps_differentiation(student_inner, expected_inner)
                if inner_comparison != "Correct!":
                    return f"Inner function error: {inner_comparison}"

                # Compare the exponents
                if int(student_exp) != int(expected_exp):
                    return f"Exponent error: Expected exponent {expected_exp} but got {student_exp}."


        else:
            if sp != ep:
                if '*x' in sp and '*x' in ep:
                    student_coeff = int(re.findall(r'[+-]?\d*\.?\d*', sp.split('*x')[0])[0]) if sp.split('*x')[0] != '' else 1
                    expected_coeff = int(re.findall(r'[+-]?\d*\.?\d*', ep.split('*x')[0])[0]) if sp.split('*x')[0] != '' else 1
                    if abs(student_coeff) != abs(expected_coeff) and expected_coeff != '':
                        return f"Coefficient error: Expected {expected_coeff} but got {student_coeff}."
                    elif student_coeff != expected_coeff:
                        return f"Sign error: Expected {expected_coeff} but got {student_coeff}."
                    elif expected_coeff == '':
                        return f"Coefficient error: Expected no coefficients but got {student_coeff}."

                    if 'x^' in sp and 'x^' in ep:
                        student_exp = int(sp.split('x^')[1])
                        expected_exp = int(ep.split('x^')[1])
                        if student_exp != expected_exp:
                            return f"Exponent error: Expected exponent {expected_exp} but got {student_exp}."
                    elif 'x^' in sp and 'x^' not in ep:
                        student_exp = sp.split('x^')[1]
                        return f"Quadratic differentiation error: No exponent was expected but got x^{student_exp}."
                    elif 'x^' in ep and 'x^' not in sp:
                        expected_exp = ep.split('x^')[1]
                        return f"Exponent error: You missed the exponent. x^{expected_exp} was expected."
    
    return "Correct!"


def concept_guidance(error):
    concept_explanations = {
        "Coefficient error": "Check the coefficients in your differentiation steps. Remember, coefficients should be directly multiplied with the derivative of the function.",
        "Exponent error": "Review the power rule: If f(x) = x^n, then f'(x) = n*x^(n-1). Ensure you're correctly decrementing the exponent.",
        "Trigonometric function error": "Recall the derivatives of trigonometric functions: d(tan(x))/dx = sec^2(x), d(sin(x))/dx = cos(x), and d(cos(x))/dx = -sin(x).",
        "Logarithmic function error": "For logarithms, the derivative of log(x) is 1/x. Ensure this is applied correctly.",
        "Exponential function error": "Remember, the derivative of e^x is e^x. Make sure this is correctly applied.",
        "Linear function error": "Remember, the derivative of linear function is the coefficient of that function itself. Make sure this is correctly applied.",
        "Quadratic differentiation error": "The derivative of quadratic function eliminates the exponents, therefore no exponents will be generated.",
        "Function error": "The functions do not match. Remember to differentiate the function using respective rule.",
        "Inner function error": "The nested functions do not match. Remember to differentiate the inner function in nested step.",
        "Unknown error": "Refer to the relevant differentiation rules and concepts one more time.",
        "Constant error": "The derivative of a constant is 0. Ensure you're applying this rule correctly.",
        "Sign error": "Check for the positive and negative signs of the derivative carefully."
    }
    
    for key in concept_explanations:
        if key in error:
            return concept_explanations[key]
    return "The Error Is Out Of Context. Please Check The Structure"



def analyze_solution_differentiation(student_steps, expected_steps, nest_status, incorrect_counts):
    feedback = []
    hint = []
    all_correct = True
    feedback_final = ""

    if len(student_steps) > len(expected_steps):
        for i in range(len(expected_steps), len(student_steps)):
            feedback.append(f"Step {i + 1}: No such extra steps are required.")
        return feedback, False, "Too many steps provided."

    for i in range(len(student_steps)):
        step_feedback = []
        step_hint = []
        main_step_correct = True
        nested_steps_correct = True

        incorrect_counts[i] = incorrect_counts.get(i, [0])  

        if not nest_status[i]:
            student_step = student_steps[i]['value'].strip()
            expected_step = expected_steps[i].strip()

            if student_step == expected_step:
                step_feedback.append(f"Step {i + 1}: Correct Step!")
                incorrect_counts[i][0] = 0  
            else:
                all_correct = False
                main_step_correct = False
                incorrect_counts[i][0] += 1 

                error = compare_steps_differentiation(student_step, expected_step)
                concept = concept_guidance(error)

                if incorrect_counts[i][0] >= 3:
                    step_feedback.append(f"Step {i + 1}: Incorrect.\n {error} {concept}")
                    step_hint.append(f"Hint : {concept}")
                else:
                    step_feedback.append(f"Step {i + 1}: Incorrect. Please try again.")
                    step_hint.append(f"Hint : {concept}")

            if student_steps[i]['nestedSteps']:
                step_feedback.append([f"For Step {i + 1}: Nested steps are not required, since it's not a nested expression."])

        if nest_status[i]:
            student_step = student_steps[i]['value'].strip()
            expected_step = expected_steps[i][0].strip()
            student_nested_steps = student_steps[i]['nestedSteps']
            expected_nested_steps = expected_steps[i][1]

            if student_step == expected_step:
                step_feedback.append(f"Step {i + 1}: Correct Step!")
                incorrect_counts[i][0] = 0  
            else:
                all_correct = False
                main_step_correct = False
                incorrect_counts[i][0] += 1  

                error = compare_steps_differentiation(student_step, expected_step)
                concept = concept_guidance(error)

                if incorrect_counts[i][0] >= 3:
                    step_feedback.append(f"Step {i + 1}: Incorrect.\n {error} {concept}")
                    step_hint.append(f"Hint : {concept}")
                else:
                    step_feedback.append(f"Step {i + 1}: Incorrect. Please try again.")
                    step_hint.append(f"Hint : {concept}")

            nested_feedback = []
            nested_hint = []

            for j in range(len(student_nested_steps)):
                student_nested_step = student_nested_steps[j]
                expected_nested_step = expected_nested_steps[j]

                if student_nested_step == expected_nested_step:
                    nested_feedback.append(f"Nested Step {j + 1}: Correct Nested Step!")
                    if len(incorrect_counts[i]) <= j + 1:
                        incorrect_counts[i].append(0)  
                    else:
                        incorrect_counts[i][j + 1] = 0  
                else:
                    all_correct = False
                    nested_steps_correct = False
                    if len(incorrect_counts[i]) <= j + 1:
                        incorrect_counts[i].append(1)  
                    else:
                        incorrect_counts[i][j + 1] += 1 

                    error = compare_steps_differentiation(student_nested_step, expected_nested_step)
                    concept = concept_guidance(error)

                    if incorrect_counts[i][-1] >= 3:  
                        nested_feedback.append(f"Nested Step {j + 1}: Incorrect.\n {error} {concept}")
                        nested_hint.append(f"Hint : {concept}")
                    else:
                        nested_feedback.append(f"Nested Step {j + 1}: Incorrect. Please try again.")
                        nested_hint.append(f"Hint : {concept}")

            step_feedback.append(nested_feedback)
            step_hint.append(nested_hint)

        if not main_step_correct:
            feedback_final = f"Main Step {i + 1} is incorrect."
        elif not nested_steps_correct:
            feedback_final = f"Main Step {i + 1} is correct, but some nested steps are incorrect."

        feedback.append(step_feedback)
        hint.append(step_hint)

    if all_correct:
        feedback_final = "Correct! Solution complete. Well done!"

    return feedback, hint, all_correct, feedback_final, incorrect_counts

incorrect_counts = {}

def simplify_expression(expression_str):
    
    expression_str = expression_str.replace('^', '**')
   
    x = sp.symbols('x')
    e = sp.E

    expression = sp.sympify(expression_str)

    simplified_expr = sp.simplify(expression)
    simplified_expr_final = str(simplified_expr).replace('**', '^')

    return simplified_expr_final


@app.route('/differentiate', methods=['POST'])

def differentiate():
    function = request.json['function']
    student_steps = request.json['steps']
    combined_exp = request.json['combined']
    incorrect_counts = {step['index']: step.get('incorrect_count', 0) for step in student_steps}  

    nest_status = nested_status(function)

    parsed_function = parse_function_main(function)
    print(parsed_function)

    expected_steps = apply_differentiation_main(parsed_function)

    feedback, hint, all_correct, feedback_final, updated_incorrect_counts = analyze_solution_differentiation(
        student_steps, expected_steps, nest_status, incorrect_counts
    )
    if all_correct:
        simplified_exp = simplify_expression(combined_exp)
    else:
        simplified_exp = ''

    print("\nParsed Function : ", parsed_function)
    print("\nStudent Steps : ", student_steps)
    print("\nExpected Steps : ", expected_steps)
    print("\nNest Status : ", nest_status)
    print("\nIncorrect Counts :", updated_incorrect_counts)

    if len(expected_steps) == len(student_steps):
        all_steps_entered = True
    else:
        all_steps_entered = False
    print("\nAll Steps Entered : ", all_steps_entered)

    return jsonify({
        'feedback_final': feedback_final,
        'all_correct': all_correct,
        'feedback': feedback,
        'hint': hint,
        'expected_steps': expected_steps,
        'all_steps_entered': all_steps_entered, 
        'incorrect_counts': updated_incorrect_counts,
        'simplified_exp': simplified_exp
    })

if __name__ == '__main__':
    app.run(debug=True)
