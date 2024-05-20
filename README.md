This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

{/_ TODO _/}
<Accordion
// expanded={isTxExpanded}
// compact
// onChange={onClickShowTransactionDetails}
// isDragging={isThisTxBeingDragging}
// TransitionProps={{ unmountOnExit: true }}

> {/_ <div {...provided.dragHandleProps}> _/}
> {/\* <AccordionSummary

     expandIcon={false}
     style={{ cursor: reorderTransactions ? 'grab' : 'pointer' }}

> _/}
> {/_ Drag & Drop Indicator _/}
> {/_ {reorderTransactions && (

         <Tooltip
           placement="top"
           title="Drag and Drop"
           backgroundColor="primary"
           textColor="white"
           arrow
         >
           // <DragAndDropIndicatorIcon fontSize="small" />
         </Tooltip> )} */}

{/_ Destination Address label _/}
{/_ <EthHashInfo
shortName={networkPrefix || ''}
hash={to}
shortenHash={4}
shouldShowShortName
/> _/}
{/_ <WalletTypography>{networkPrefix || ''}</WalletTypography> _/}
{/_ Transaction Description label _/}
{/_ <WalletTypography>{transactionDescription}</WalletTypography> _/}
{/\* {replaceTransaction && (
// <Box
// onClick={event => {
// event.stopPropagation();
// setTxIndexToEdit(String(index));
// openEditTxModal();
// }}
// sx={{ width: '18px', height: '19px' }}
// >
// <IconEdit />
// </Box>

       // <Tooltip title="Edit transaction" backgroundColor="primary" textColor="white" arrow>
       //   <TransactionActionButton
       //     size="medium"
       //     aria-label="Edit transaction"
       //     onClick={event => {
       //       event.stopPropagation();
       //       setTxIndexToEdit(String(index));
       //       openEditTxModal();
       //     }}
       //   >
       //     <Icon size="sm" type="edit" />
       //   </TransactionActionButton>
       // </Tooltip>
     // )}


     // {removeTransaction && (
       // <Box
       //   onClick={event => {
       //     event.stopPropagation();
       //     setTxIndexToRemove(String(index));
       //     openDeleteTxModal();
       //   }}
       //   sx={{ width: '18px', height: '19px' }}
       // >
       //   {' '}
       //   <IconTrash />
       // </Box>

       // <Tooltip
       //   placement="top"
       //   title="Delete transaction"
       //   backgroundColor="primary"
       //   textColor="white"
       //   arrow
       // >
       //   <TransactionActionButton
       // onClick={event => {
       //   event.stopPropagation();
       //   setTxIndexToRemove(String(index));
       //   openDeleteTxModal();
       // }}
       //     size="medium"
       //     aria-label="Delete transaction"
       //   >
       //     <Icon size="sm" type="delete" />
       //   </TransactionActionButton>
       // </Tooltip>
     // )}


     // {showTransactionDetails && (
       // <Box
       //   onClick={event => {
       //     event.stopPropagation();
       //     onClickShowTransactionDetails();
       //   }}
       //   sx={{ width: '18px', height: '19px' }}
       // >
       //   <IconEdit />
       // </Box>
       // <Tooltip
       //   placement="top"
       //   title="Expand transaction details"
       //   backgroundColor="primary"
       //   textColor="white"
       //   arrow
       // >
       //   <TransactionActionButton
       //     onClick={event => {
       //       event.stopPropagation();
       //       onClickShowTransactionDetails();
       //     }}
       //     size="medium"
       //     aria-label="Expand transaction details"
       //   >
       //     <FixedIcon type={'chevronDown'} />
       //   </TransactionActionButton>
       // </Tooltip>
     // )}

// </AccordionSummary>
// {/_ </div> _/}
{/_ </Accordion> _/}
