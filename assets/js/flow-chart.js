// assets/js/flow-chart.js

document.addEventListener('DOMContentLoaded', function () {
    const flowChartBlocks = document.querySelectorAll('pre code.language-flow-chart');

    flowChartBlocks.forEach(block => {
        const parentPre = block.parentNode; // Get the <pre> element
        const lineRegex = /^\s*\d+\.\s*(.*)/; // Regex to match lines like "1. text"

        // Robust parsing strategy
        let rawHtmlContent = block.innerHTML;
        let processedContent = rawHtmlContent.replace(/<br\s*\/?>/gi, '\n'); // Normalize <br> to \n

        // To strip any other potential HTML tags and decode entities:
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedContent;
        const cleanTextContent = tempDiv.textContent || tempDiv.innerText;

        let lines = cleanTextContent.split('\n')
            .map(line => line.trim())
            .filter(line => lineRegex.test(line));
        
        // Note: The original extensive fallback logic for 'lines.length === 0' is removed by this replacement.
        // If this robust parsing is insufficient, specific fallbacks might need to be re-added carefully.
        
        // Fallback for cases where the markdown is directly in a div with a specific class
        if (lines.length === 0 && parentPre.tagName !== 'PRE' && parentPre.classList.contains('flow-chart-markdown')) {
            const divContent = parentPre.textContent || parentPre.innerText;
            const divLines = divContent.split('\\n')
                .map(line => line.trim())
                .filter(line => lineRegex.test(line));
            if (divLines.length > 0) {
                lines.push(...divLines);
            }
        }

        if (lines.length > 0) {
            const flowChartContainer = document.createElement('div');
            flowChartContainer.className = 'flow-chart-container';

            lines.forEach(line => {
                const match = line.match(lineRegex);
                if (!match) return; // Should not happen due to filter, but good practice

                const itemText = match[1].trim();
                // const itemNumber = line.match(/^\s*(\d+)\./)[1]; // Extract number if needed later for display

                const itemDiv = document.createElement('div');
                itemDiv.className = 'flow-chart-item';
                
                // Create a span for the step number (optional, can be styled with CSS counters too)
                // For now, the dot from ::before serves as the step marker.
                // If explicit numbers are needed in the box, we can add them here.

                const contentDiv = document.createElement('div');
                contentDiv.className = 'flow-chart-content';
                
                const paragraph = document.createElement('p');
                paragraph.textContent = itemText;
                
                contentDiv.appendChild(paragraph);
                itemDiv.appendChild(contentDiv);
                flowChartContainer.appendChild(itemDiv);
            });

            // Replace the <pre> block (or the custom div) with the generated flow chart
            if (parentPre.tagName === 'PRE' || parentPre.classList.contains('flow-chart-markdown')) {
                 parentPre.parentNode.replaceChild(flowChartContainer, parentPre);
            } else {
                // If it's some other structure, try to replace the code block's direct parent
                // This is less ideal but a fallback.
                const grandparent = parentPre.parentNode;
                if (grandparent) {
                    grandparent.parentNode.replaceChild(flowChartContainer, grandparent);
                }
            }
        } else {
            // If after all attempts, no valid flow chart items are found,
            // we might leave a message or just the original content.
            // For now, let's leave the original content.
            console.warn("Could not parse flow-chart content from block:", block);
        }
    });

    // Also process elements specifically marked with a class, e.g., <div class="flow-chart-markdown-source">...markdown...</div>
    const manualFlowChartElements = document.querySelectorAll('.flow-chart-markdown-source');
    manualFlowChartElements.forEach(element => {
        const lineRegex = /^\s*\d+\.\s*(.*)/; // Regex to match lines like "1. text"

        // Robust parsing for manual divs
        let rawHtmlContent = element.innerHTML;
        let processedContent = rawHtmlContent.replace(/<br\s*\/?>/gi, '\n');

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedContent;
        const cleanTextContent = tempDiv.textContent || tempDiv.innerText;

        const lines = cleanTextContent.split('\n')
            .map(line => line.trim())
            .filter(line => lineRegex.test(line));

        if (lines.length > 0) {
            const flowChartContainer = document.createElement('div');
            flowChartContainer.className = 'flow-chart-container';

            lines.forEach(line => {
                const match = line.match(lineRegex);
                if (!match) return;
                const itemText = match[1].trim();
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'flow-chart-item';
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'flow-chart-content';
                
                const paragraph = document.createElement('p');
                paragraph.textContent = itemText;
                
                contentDiv.appendChild(paragraph);
                itemDiv.appendChild(contentDiv);
                flowChartContainer.appendChild(itemDiv);
            });
            element.parentNode.replaceChild(flowChartContainer, element);
        } else {
            console.warn("Could not parse flow-chart content from manual element:", element);
        }
    });
});
